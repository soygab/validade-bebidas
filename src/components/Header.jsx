// Cabeçalho: título e a data de hoje por extenso (ex.: "terça-feira, 17 de novembro").
// Para trocar o título, edito o <h1>.
const data = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Header() {
  return (
    <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
      <h1 className="font-cond text-4xl font-bold leading-none sm:text-5xl">Validade</h1>
      <span className="capitalize text-mut">{data}</span>
    </header>
  );
}
