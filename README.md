# Validade das bebidas

React + Vite + Tailwind 3 + Supabase (banco e login compartilhados pela equipe).

## Rodar no PC
1. Copie `.env.example` para `.env.local` e preencha URL e chave do Supabase.
2. `npm install` e `npm run dev` (abre em http://localhost:5173/validade/).

## Banco (Supabase)
- Rodar `supabase/schema.sql` e depois `supabase/2-equipe-com-codigo.sql` no SQL Editor (trocar o código antes!).
- Authentication: deixar "Allow new users to sign up" LIGADO e "Confirm email" DESLIGADO.
- Cada pessoa cria a própria conta no app e digita o código da equipe.

## Deploy
- Push na `main` roda `.github/workflows/publicar.yml` e publica em codedbygab.com/validade/.

## Onde mexer
| Quero mudar...                       | Arquivo                       |
|--------------------------------------|-------------------------------|
| Cores (claro e escuro)               | `src/index.css`               |
| Unidades, status                     | `src/constants.js`            |
| Regra de vencimento                  | `src/utils/dates.js`          |
| Banco / tabelas / permissões         | `supabase/schema.sql`, `src/hooks/useEstoque.js` |
| Login e código da equipe             | `src/components/Login.jsx`, `CodigoEquipe.jsx`, `supabase/2-equipe-com-codigo.sql` |
| Formulário                           | `src/components/ItemForm.jsx` |
| Linha da lista                       | `src/components/ItemRow.jsx`  |
| Importação de texto                  | `src/utils/lerTexto.js`       |
