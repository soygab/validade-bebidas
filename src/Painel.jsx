// A tela principal (só aparece depois do login). Antes era o App.jsx.
// Controla os FILTROS (aba, local, pessoa, busca). Os DADOS vêm do hook useEstoque.
//
// Mapa rápido de onde mexer:
//   cores ............. src/index.css
//   unidades/status ... src/constants.js
//   regra de vencer ... src/utils/dates.js
//   banco de dados .... src/hooks/useEstoque.js + supabase/schema.sql
//   login/código ...... src/components/Login.jsx, CodigoEquipe.jsx
//   formulário ........ src/components/ItemForm.jsx
//   linha da lista .... src/components/ItemRow.jsx
//   importar texto .... src/components/ImportarTexto.jsx + src/utils/lerTexto.js
import { useMemo, useState } from 'react';
import Abas from './components/Abas';
import Configuracoes from './components/Configuracoes';
import Filtros from './components/Filtros';
import Header from './components/Header';
import ImportarTexto from './components/ImportarTexto';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import { useEstoque } from './hooks/useEstoque';
import { supabase } from './lib/supabase';
import { statusDe } from './utils/dates';

export default function Painel({ quem }) {
  const { itens, locais, alerta, carregando, erro, adicionar, adicionarVarios, ajustar, remover, novoLocal, setAlerta, importar } = useEstoque();

  const [status, setStatus] = useState('todos');
  const [local, setLocal] = useState('');
  const [pessoa, setPessoa] = useState('');
  const [busca, setBusca] = useState('');

  const contagem = useMemo(() => {
    const c = { todos: itens.length, v: 0, a: 0, o: 0 };
    itens.forEach((i) => c[statusDe(i.val, alerta)]++);
    return c;
  }, [itens, alerta]);

  // Emails de quem já cadastrou algo (alimenta o filtro "Toda a equipe").
  const pessoas = useMemo(() => [...new Set(itens.map((i) => i.por).filter(Boolean))].sort(), [itens]);

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return itens
      .filter((i) => (!local || i.local === local)
        && (!pessoa || i.por === pessoa)
        && (!q || i.nome.toLowerCase().includes(q))
        && (status === 'todos' || statusDe(i.val, alerta) === status))
      // Ordem: quem vence primeiro aparece primeiro (PEPS). Para inverter, troco a por b.
      .sort((a, b) => a.val.localeCompare(b.val));
  }, [itens, local, pessoa, busca, status, alerta]);

  if (carregando) return <p className="p-6 text-mut">Carregando…</p>;

  return (
    <main className="mx-auto max-w-3xl px-3.5 pb-10 pt-5">
      <Header quem={quem} onSair={() => supabase.auth.signOut()} />
      {erro && <p className="mb-3 rounded-md border border-line bg-surf p-3 text-bad">Erro: {erro}</p>}
      <ItemForm locais={locais} onAdd={adicionar} />
      <ImportarTexto locais={locais} onAdd={adicionarVarios} />
      <Abas ativa={status} onChange={setStatus} contagem={contagem} />
      <Filtros busca={busca} onBusca={setBusca} locais={locais} local={local} onLocal={setLocal}
        onNovoLocal={novoLocal} pessoas={pessoas} pessoa={pessoa} onPessoa={setPessoa} />
      <ItemList itens={visiveis} alerta={alerta} onAjustar={ajustar} onRemover={remover}
        vazio={itens.length ? 'Nenhuma bebida com esse filtro.' : 'Nada cadastrado ainda. Adicione a primeira bebida acima.'} />
      <Configuracoes dados={{ itens, locais, alerta }} onAlerta={setAlerta} onImportar={importar} />
    </main>
  );
}
