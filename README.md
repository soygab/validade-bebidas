# Validade das bebidas

React + Vite + Tailwind CSS 3.

    npm install
    npm run dev      # desenvolvimento
    npm run build    # gera /dist

## Onde mexer

| Quero mudar...                          | Arquivo                          |
|-----------------------------------------|----------------------------------|
| Cores (claro e escuro)                  | `src/index.css`                  |
| Fontes                                  | `index.html` + `tailwind.config.js` |
| Locais iniciais, unidades, status       | `src/constants.js`               |
| Regra de vencimento / textos de dias    | `src/utils/dates.js`             |
| Como os dados são salvos                | `src/hooks/useEstoque.js`        |
| Campos do formulário                    | `src/components/ItemForm.jsx`    |
| Visual de cada linha da lista           | `src/components/ItemRow.jsx`     |
| Regras da importação de texto           | `src/utils/lerTexto.js`          |
| Filtros, abas, backup                   | `components/Filtros`, `Abas`, `Configuracoes` |

Dados: salvos no localStorage do navegador; backup em JSON pela própria tela.
