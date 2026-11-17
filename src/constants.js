// Valores fixos do app. Quase tudo que eu quero ajustar com frequência está aqui.

// Chave do localStorage. Se eu mudar, os dados salvos "somem" (ficam na chave antiga).
export const STORAGE_KEY = 'validade-bebidas-v1';

// Locais que já vêm cadastrados. Para mudar os iniciais, edito esta lista.
// (Só vale para quem ainda não salvou nada; locais novos eu crio pela tela, no "+ local".)
export const LOCAIS_PADRAO = ['Câmara fria', 'Geladeira Heineken', 'Geladeira Spaten', 'Geladeira Coca', 'Geladeira FYS'];

// Opções do seletor de quantidade: [valor salvo, texto que aparece no select].
// Para criar uma unidade nova (ex.: "Barril"), adiciono aqui E em UNIDADES logo abaixo.
export const OPCOES_UN = [['un', 'Unidade'], ['fardo', 'Fardo'], ['caixa', 'Caixa']];

// Texto mostrado na lista: [singular, plural]. Ex.: 1 fardo, 3 fardos.
export const UNIDADES = {
  un: ['unidade', 'unidades'],
  fardo: ['fardo', 'fardos'],
  caixa: ['caixa', 'caixas'],
};

// Os 3 status de validade. As classes (bg-badb, text-bad...) vêm das cores do index.css.
// Escrevo a classe inteira porque o Tailwind só gera o CSS do que aparece escrito no código.
//   label = nome na aba | stub = cor do bloco da data | txt = cor do texto "Vence em X dias"
export const STATUS = {
  v: { label: 'Vencidos', stub: 'bg-badb text-badx', txt: 'text-bad' },
  a: { label: 'Vencem logo', stub: 'bg-wrnb text-wrnx', txt: 'text-wrn' },
  o: { label: 'No prazo', stub: 'bg-okb text-okx', txt: 'text-ok' },
};
