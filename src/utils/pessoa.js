// Se for email, mostra só a parte antes do @ ("gabi@bar.com" vira "gabi"). Se já for um nome, não muda nada.
export const nomePessoa = (email = '') => email.split('@')[0];
