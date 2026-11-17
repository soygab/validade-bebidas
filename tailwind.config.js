// Configuração do Tailwind.
// As cores NÃO ficam aqui: elas ficam em src/index.css, nas variáveis (--bg, --ink...).
// Aqui eu só dou um nome do Tailwind para cada variável, e assim posso usar
// classes como "bg-surf", "text-mut" ou "border-line" nos componentes.
// Por causa disso, o tema claro/escuro troca sozinho sem eu escrever "dark:" em lugar nenhum.
const v = (n) => `var(--${n})`;

export default {
  // Onde o Tailwind procura classes. Se eu criar uma pasta nova fora de src, adiciono aqui.
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),       // fundo da página
        surf: v('surf'),   // fundo de formulário, lista e inputs
        tx: v('tx'),       // texto principal
        mut: v('mut'),     // texto secundário (cinza)
        line: v('bd'),     // bordas e divisórias
        ink: v('ink'),     // cor principal (botão Adicionar, chip ativo)
        inkx: v('inkx'),   // texto que fica em cima da cor principal
        // Status: x = texto sobre o bloco, b = cor do bloco da data, sem sufixo = cor do texto
        bad: v('bad'), badb: v('badb'), badx: v('badx'),   // vencido
        wrn: v('wrn'), wrnb: v('wrnb'), wrnx: v('wrnx'),   // vence logo
        ok: v('ok'), okb: v('okb'), okx: v('okx'),         // no prazo
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'], // texto geral (font-sans)
        cond: ['"Barlow Condensed"', 'Barlow', 'sans-serif'],                       // números e título (font-cond)
      },
    },
  },
};
