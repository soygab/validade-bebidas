// Importar uma contagem pronta: eu colo o texto, o app mostra como entendeu
// e só adiciona na lista quando eu clico no botão.
// A leitura do texto está em src/utils/lerTexto.js (é lá que eu mudo as regras).
import { useMemo, useState } from 'react';
import { UNIDADES } from '../constants';
import { lerTexto } from '../utils/lerTexto';
import { Campo, campo } from '../ui';

// Exemplo que aparece dentro da caixa vazia (placeholder).
const EXEMPLO = `Geladeira Heineken
Heineken: (1 fardo) 25/12/26

Geladeira Spaten
Baden Baden Ipa; 2 fardos; 15/12/2026
Heineken Ultimate - 20/01/2027 - 1 caixa

Câmara fria
Coca-Cola 2L, 3 un, 10/02/27
Brahma; Geladeira 2; 05/12/2026`;

export default function ImportarTexto({ locais, onAdd }) {
  const [texto, setTexto] = useState('');
  // Local usado nas linhas que não dizem o local (nem têm título de local acima).
  const [padrao, setPadrao] = useState(locais[0]);
  const padraoOk = locais.includes(padrao) ? padrao : locais[0];

  // Reinterpreta o texto a cada letra digitada/colada.
  const linhas = useMemo(() => lerTexto(texto, locais, padraoOk), [texto, locais, padraoOk]);
  const validos = linhas.filter((l) => l.item);
  const erros = linhas.length - validos.length;
  // Locais que aparecem no texto mas ainda não existem: serão criados ao adicionar.
  const novos = [...new Set(validos.map((l) => l.item.local).filter((x) => !locais.includes(x)))];

  const adicionar = () => {
    onAdd(validos.map((l) => l.item)); // cadastra todos de uma vez e cria os locais novos (ver adicionarVarios no useEstoque)
    setTexto('');
  };

  return (
    <details className="mb-6 rounded-xl border border-line bg-surf p-3.5">
      <summary className="cursor-pointer font-semibold">Importar de texto (notas, lista pronta)</summary>

      <p className="mt-2 text-sm text-mut">
        Uma bebida por linha, com nome e data. O local pode vir na linha ou num título acima
        (ex.: uma linha só com “Geladeira Heineken”; se o local não existir, ele é criado). Quantidade é opcional:
        2 fardos, (1 fardo), 3 caixas, 12 un, 3x.
      </p>

      <Campo label="Local padrão (para linhas sem local)" className="mt-3 max-w-xs">
        <select className={`${campo} w-full`} value={padraoOk} onChange={(e) => setPadrao(e.target.value)}>
          {locais.map((l) => <option key={l}>{l}</option>)}
        </select>
      </Campo>

      <textarea className={`${campo} mt-3 w-full font-mono text-sm`} rows={7} value={texto}
        onChange={(e) => setTexto(e.target.value)} placeholder={EXEMPLO} aria-label="Texto para importar" />

      {/* Prévia: mostra o que o app entendeu de cada linha */}
      {linhas.length > 0 && (
        <ul className="mt-3 max-h-64 divide-y divide-line overflow-y-auto rounded-md border border-line text-sm">
          {linhas.map((l, i) => (
            <li key={i} className="px-3 py-2">
              {l.item ? (
                <>
                  <b>{l.item.nome}</b>
                  <span className="text-mut">
                    {' '}· {l.item.qtd} {UNIDADES[l.item.un][l.item.qtd === 1 ? 0 : 1]} · {l.item.local}{locais.includes(l.item.local) ? '' : ' (novo)'} ·{' '}
                    {l.item.val.split('-').reverse().join('/')}
                  </span>
                </>
              ) : (
                <span className="text-bad">{l.erro}: <span className="text-mut">{l.original}</span></span>
              )}
            </li>
          ))}
        </ul>
      )}

      {novos.length > 0 && (
        <p className="mt-2 text-sm text-mut">Locais novos que serão criados: {novos.join(', ')}.</p>
      )}

      {linhas.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" disabled={!validos.length} onClick={adicionar}
            className="rounded-md bg-ink px-4 py-2.5 font-semibold text-inkx disabled:opacity-40">
            Adicionar {validos.length} {validos.length === 1 ? 'item' : 'itens'}
          </button>
          {erros > 0 && <span className="text-sm text-mut">{erros} {erros === 1 ? 'linha será ignorada' : 'linhas serão ignoradas'}.</span>}
        </div>
      )}
    </details>
  );
}
