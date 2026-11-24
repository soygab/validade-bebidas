// Cabeçalho: título, data de hoje, nome de quem está logado e o botão Sair.
import { nomePessoa } from '../utils/pessoa';

const data = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Header({ quem, onSair }) {
  return (
    <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
      <h1 className="font-cond text-4xl font-bold leading-none sm:text-5xl">Validade</h1>
      <div className="flex flex-wrap items-baseline gap-3 text-mut">
        <span className="capitalize">{data}</span>
        <span>{nomePessoa(quem)}</span>
        <button type="button" className="underline" onClick={onSair}>Sair</button>
      </div>
    </header>
  );
}
