// Funções de data. Toda a regra de "quando vence" mora aqui.

// Nomes curtos dos meses mostrados no bloco da data.
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Quantos dias faltam até a validade (negativo = já venceu).
// Comparo sempre com a meia-noite de hoje, para a hora do dia não atrapalhar a conta.
export function diasAte(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  return Math.round((new Date(y, m - 1, d) - hoje) / 864e5);
}

// Decide a cor do item. "alerta" é o nº de dias configurado na tela (padrão 7).
//   'v' = vencido (já passou) | 'a' = vence logo (até "alerta" dias) | 'o' = no prazo
// Se eu quiser uma regra diferente (ex.: 4 faixas), mexo aqui e em STATUS (constants.js).
export function statusDe(iso, alerta) {
  const d = diasAte(iso);
  return d < 0 ? 'v' : d <= alerta ? 'a' : 'o';
}

// Frase que aparece embaixo do nome ("Vence amanhã", "Vencido há 2 dias"...).
export function textoDias(d) {
  if (d < 0) return `Vencido há ${-d} dia${d === -1 ? '' : 's'}`;
  if (d === 0) return 'Vence hoje';
  if (d === 1) return 'Vence amanhã';
  return `Vence em ${d} dias`;
}

// Quebra '2026-11-17' em partes para o bloco colorido: dia "17", mês "nov", ano "26".
export function partesData(iso) {
  const [y, m, d] = iso.split('-');
  return { dia: d, mes: MESES[+m - 1], ano: y.slice(2) };
}
