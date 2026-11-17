// Componente principal: junta tudo e controla os FILTROS (aba, local, busca).
// Os DADOS (itens, locais, alerta) vêm do hook useEstoque.
//
// Mapa rápido de onde mexer:
//   cores ............. src/index.css
//   unidades/status ... src/constants.js
//   regra de vencer ... src/utils/dates.js
//   salvar/dados ...... src/hooks/useEstoque.js
//   formulário ........ src/components/ItemForm.jsx
//   importar texto .... src/components/ImportarTexto.jsx + src/utils/lerTexto.js
//   linha da lista .... src/components/ItemRow.jsx
import { useMemo, useState } from 'react';
import Abas from './components/Abas';
import Configuracoes from './components/Configuracoes';
import Filtros from './components/Filtros';
import Header from './components/Header';
import ImportarTexto from './components/ImportarTexto';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import { useEstoque } from './hooks/useEstoque';
import { statusDe } from './utils/dates';

export default function App() {
  const { itens, locais, alerta, adicionar, adicionarVarios, ajustar, remover, novoLocal, setAlerta, importar } = useEstoque();

  // Filtros ativos. '' no local = todos os locais; 'todos' no status = todas as abas.
  const [status, setStatus] = useState('todos');
  const [local, setLocal] = useState('');
  const [busca, setBusca] = useState('');

  // Números das abas: total, vencidos (v), vencem logo (a) e no prazo (o).
  const contagem = useMemo(() => {
    const c = { todos: itens.length, v: 0, a: 0, o: 0 };
    itens.forEach((i) => c[statusDe(i.val, alerta)]++);
    return c;
  }, [itens, alerta]);

  // Lista que aparece na tela: aplica local + busca + aba e ordena pela validade.
  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return itens
      .filter((i) => (!local || i.local === local)
        && (!q || i.nome.toLowerCase().includes(q))
        && (status === 'todos' || statusDe(i.val, alerta) === status))
      // Ordem: quem vence primeiro aparece primeiro (PEPS). Para inverter, troco a por b.
      .sort((a, b) => a.val.localeCompare(b.val));
  }, [itens, local, busca, status, alerta]);

  return (
    // max-w-3xl = largura máxima do app no PC. Para alargar, troco por max-w-4xl, max-w-5xl...
    <main className="mx-auto max-w-3xl px-3.5 pb-10 pt-5">
      <Header />
      <ItemForm locais={locais} onAdd={adicionar} />
      <ImportarTexto locais={locais} onAdd={adicionarVarios} />
      <Abas ativa={status} onChange={setStatus} contagem={contagem} />
      <Filtros busca={busca} onBusca={setBusca} locais={locais} local={local}
        onLocal={setLocal} onNovoLocal={novoLocal} />
      <ItemList itens={visiveis} alerta={alerta} onAjustar={ajustar} onRemover={remover}
        vazio={itens.length ? 'Nenhuma bebida com esse filtro.' : 'Nada cadastrado ainda. Adicione a primeira bebida acima.'} />
      <Configuracoes dados={{ itens, locais, alerta }} onAlerta={setAlerta} onImportar={importar} />
    </main>
  );
}
