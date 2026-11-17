// Lê um texto colado (notas do celular, WhatsApp, planilha) e transforma em itens.
// Regras que eu criei (se eu quiser aceitar outro formato, mexo AQUI):
//   - 1 bebida por linha
//   - a DATA é obrigatória: 15/12/2026, 15/12/26, 15-12-2026, 2026-12-15 ou só 15/12
//   - o LOCAL pode vir na linha ("Brahma; Geladeira 2; 05/12/2026")
//     ou num título acima ("Geladeira 2" sozinho numa linha, valendo para as linhas de baixo)
//     Um título de local que NÃO existe ainda (ex.: "geladeira heineken") vira um local novo,
//     criado na hora em que eu confirmo a importação.
//   - a QUANTIDADE é opcional: "2 fardos", "(1 fardo)", "3 caixas", "12 un", "3x" ou "x3" (padrão: 1 unidade)
//   - o que sobrar vira o NOME
// Devolve uma lista: { original, item } quando deu certo ou { original, erro } quando não.

// Tira acento e maiúscula, para comparar "Câmara" com "camara".
const sem = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Confere se a data existe de verdade (31/02 não vale) e devolve 'AAAA-MM-DD'.
function montarData(d, m, a) {
  const dt = new Date(a, m - 1, d);
  if (dt.getFullYear() !== a || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return `${a}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// Procura uma data no texto. Devolve { iso, trecho } (iso = null se a data for inválida).
function acharData(txt) {
  let m;
  if ((m = txt.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/))) {
    return { iso: montarData(+m[3], +m[2], +m[1]), trecho: m[0] };
  }
  if ((m = txt.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}|\d{2})\b/))) {
    const ano = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    return { iso: montarData(+m[1], +m[2], ano), trecho: m[0] };
  }
  // Só dia/mês: uso o ano atual. Se a data ficar mais de 60 dias no passado, uso o ano seguinte.
  if ((m = txt.match(/\b(\d{1,2})\/(\d{1,2})\b/))) {
    const hoje = new Date();
    let iso = montarData(+m[1], +m[2], hoje.getFullYear());
    if (iso && new Date(iso) < new Date(hoje.getTime() - 60 * 864e5)) {
      iso = montarData(+m[1], +m[2], hoje.getFullYear() + 1);
    }
    return { iso, trecho: m[0] };
  }
  return null;
}

// Descobre se um texto é o nome de um local cadastrado.
// Aceita o nome exato, "g1" / "gel 1" / "geladeira 1" e "camara" / "câmara fria".
function acharLocal(texto, locais) {
  const c = sem(texto).replace(/[:.]+$/, '');
  const exato = locais.find((l) => sem(l) === c);
  if (exato) return exato;
  const g = c.match(/^(?:geladeira|gel|g)\s*(\d+)$/);
  if (g) return locais.find((l) => sem(l) === `geladeira ${g[1]}`) || null;
  if (/^camara(\s+fria)?$/.test(c)) return locais.find((l) => sem(l).startsWith('camara')) || null;
  return null;
}

// Versão de "sem" que não corta espaços, para os índices continuarem batendo com o texto original.
const semI = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Procura um local cadastrado escrito NO MEIO de um campo ("Guaraná x4 Geladeira 3")
// e devolve o local + o campo sem ele. Testo os nomes maiores primeiro.
function tirarLocal(campo, locais) {
  const base = semI(campo);
  for (const l of [...locais].sort((a, b) => b.length - a.length)) {
    const alvo = semI(l);
    const i = base.indexOf(alvo);
    const fim = i + alvo.length;
    if (i < 0 || /\w/.test(base[i - 1] || ' ') || /\w/.test(base[fim] || ' ')) continue;
    return { local: l, resto: (campo.slice(0, i) + ' ' + campo.slice(fim)).trim() };
  }
  return null;
}

// Texto que PARECE local mas não está cadastrado (ex.: "Geladeira 7") vira erro, em vez de virar nome de bebida.
// Se eu usar outras palavras para locais (ex.: "bar", "estoque"), adiciono aqui.
const PARECE_LOCAL = /^(geladeira|gel|camara|freezer|balcao)\b/;
// Mesma ideia, mas para palavras de local soltas no meio do texto de uma linha.
const INLINE_LOCAL = /\b(geladeira|camara|freezer)\b/;

// "geladeira heineken" -> "Geladeira Heineken" (nome do local novo)
const nomeLocal = (t) => t.replace(/[:.]+$/, '').trim().toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

// Padrões de quantidade, do mais específico ao mais genérico.
const RE_QTD = [
  /(\d+)\s*x?\s*(fardos?|caixas?|cx|unidades?|unid\.?|un\.?)(?![a-z])/i, // 2 fardos | 3x caixas | 12 un
  /\b(\d+)\s*x\b/i,                                                       // 3x
  /\bx\s*(\d+)\b/i,                                                       // x3
  /\((\d+)\)/,                                                            // (2)
];

function tipoUnidade(u = '') {
  const s = sem(u);
  if (s.startsWith('fardo')) return 'fardo';
  if (s.startsWith('caix') || s === 'cx') return 'caixa';
  return 'un';
}

export function lerTexto(texto, locais, localPadrao) {
  const linhas = [];
  let atual = localPadrao;  // local vigente (título de local ou o padrão escolhido na tela)
  const todos = [...locais]; // locais cadastrados + os novos que aparecerem nos títulos do texto

  texto.split(/\r?\n/).forEach((bruta) => {
    // Tira marcadores do começo: "- ", "* ", "• ", "1. ", "2) "
    const l = bruta.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim().normalize('NFC');
    if (!l) return;
    const erro = (msg) => linhas.push({ original: bruta.trim(), erro: msg });

    const dt = acharData(l);

    // Linha SEM data: é um título de local ou um erro.
    if (!dt) {
      const loc = acharLocal(l, todos);
      if (loc) { atual = loc; return; }
      if (PARECE_LOCAL.test(sem(l))) {
        // Título de local que ainda não existe: guardo como local novo (o hook cria ao confirmar).
        const novo = nomeLocal(l);
        todos.push(novo);
        atual = novo;
        return;
      }
      return erro('Sem data de validade');
    }
    if (!dt.iso) return erro('Data inválida');

    // Separadores aceitos entre os campos: ;  |  tab  " - "  ,
    let campos = l.replace(dt.trecho, ' ').split(/\s*[;|\t:]\s*|\s+[-–—]\s+|\s*,\s*/)
      // limpa separadores soltos nas pontas de cada campo (sobras de "-" , ":" etc.)
      .map((c) => c.replace(/^[\s\-–—,;|:]+|[\s\-–—,;|:]+$/g, '')).filter(Boolean);

    // Local dentro da própria linha
    let local = null;
    const iLoc = campos.findIndex((c) => acharLocal(c, todos));
    if (iLoc >= 0) {
      local = acharLocal(campos[iLoc], todos);
      campos.splice(iLoc, 1);
    } else {
      // Não achei um campo só com o local: tento achar o nome do local no meio de algum campo.
      for (let i = 0; i < campos.length && !local; i++) {
        const r = tirarLocal(campos[i], todos);
        if (r) { local = r.local; campos[i] = r.resto; }
      }
      campos = campos.filter(Boolean);
    }
    const desconhecido = campos.find((c) => INLINE_LOCAL.test(sem(c)));
    if (!local && desconhecido) return erro(`Local não cadastrado: ${desconhecido}`);
    local = local || atual;

    // Quantidade e unidade
    let qtd = 1, un = 'un';
    for (const re of RE_QTD) {
      const i = campos.findIndex((c) => re.test(c));
      if (i < 0) continue;
      const m = campos[i].match(re);
      qtd = +m[1]; un = tipoUnidade(m[2]);
      campos[i] = campos[i].replace(m[0], ' ').replace(/\(\s*\)/g, ' ').trim(); // tira também o "()" que sobra
      campos = campos.filter(Boolean);
      break;
    }
    if (qtd < 1) return erro('Quantidade inválida');

    const nome = campos.join(' ').replace(/\s+/g, ' ').trim();
    if (!nome) return erro('Sem nome da bebida');

    linhas.push({ original: bruta.trim(), item: { nome, local, qtd, un, val: dt.iso } });
  });

  return linhas;
}
