// Linha de filtros: busca por nome + chips de local + botão "+ local".
// Os locais vêm da lista "locais" guardada no useEstoque.
import { useState } from 'react';
import { Chip, campo } from '../ui';

export default function Filtros({ busca, onBusca, locais, local, onLocal, onNovoLocal }) {
  // Controla o mini formulário de criar local (aparece ao clicar em "+ local").
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState('');

  const salvar = (e) => {
    e.preventDefault(); // Enter dentro do campo também salva
    if (nome.trim()) onNovoLocal(nome.trim());
    setNome('');
    setCriando(false);
  };

  return (
    <div className="my-3.5 flex flex-wrap items-center gap-2">
      <input type="search" className={`${campo} flex-[1_1_170px]`} placeholder="Buscar bebida"
        aria-label="Buscar bebida" value={busca} onChange={(e) => onBusca(e.target.value)} />

      {/* local === '' significa "sem filtro de local" */}
      <Chip ativo={local === ''} onClick={() => onLocal('')}>Todos os locais</Chip>
      {locais.map((l) => (
        <Chip key={l} ativo={local === l} onClick={() => onLocal(l)}>{l}</Chip>
      ))}

      {criando ? (
        <form onSubmit={salvar} className="flex gap-1.5">
          <input autoFocus className={`${campo} w-36 !rounded-full !py-1`} placeholder="Nome do local"
            aria-label="Nome do novo local" value={nome} onChange={(e) => setNome(e.target.value)} />
          <button type="submit" className="rounded-md border border-line bg-surf px-3">Salvar</button>
        </form>
      ) : (
        <Chip ativo={false} onClick={() => setCriando(true)}>+ local</Chip>
      )}
    </div>
  );
}
