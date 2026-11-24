// Hook que guarda os DADOS (itens e locais) e conversa com o Supabase.
// Os dados ficam no banco, então toda a equipe enxerga a mesma lista.
// Quando alguém altera algo, o Realtime avisa e eu recarrego a lista (função "carregar").
// O dias do alerta (amarelo) fica só no navegador de cada pessoa.
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const ALERTA_KEY = 'validade-bebidas-alerta';

export function useEstoque() {
  const [itens, setItens] = useState([]);   // cada item: { id, nome, local, qtd, un, val, por, criado_em }
  const [locais, setLocais] = useState([]); // lista de nomes
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [alerta, setAlertaEstado] = useState(() => {
    try { return Number(localStorage.getItem(ALERTA_KEY)) || 7; } catch { return 7; }
  });

  // Busca tudo no banco.
  const carregar = useCallback(async () => {
    const [i, l] = await Promise.all([
      supabase.from('itens').select('*').order('val'),
      supabase.from('locais').select('nome').order('nome'),
    ]);
    const falha = i.error || l.error;
    if (falha) setErro(falha.message);
    else { setErro(''); setItens(i.data); setLocais(l.data.map((x) => x.nome)); }
    setCarregando(false);
  }, []);

  // Carrega ao abrir e fica "escutando" mudanças feitas por qualquer pessoa da equipe.
  useEffect(() => {
    carregar();
    const canal = supabase.channel('estoque')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'itens' }, carregar)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locais' }, carregar)
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, [carregar]);

  // Roda uma operação do banco; se der erro mostra na tela, senão recarrega a lista.
  const exec = async (req) => {
    const { error } = await req;
    if (error) setErro(error.message); else carregar();
  };

  // Cria locais que ainda não existem (ignora os repetidos).
  const criarLocais = (nomes) =>
    supabase.from('locais').upsert(nomes.map((nome) => ({ nome })), { onConflict: 'nome', ignoreDuplicates: true });

  // Cadastra vários itens (importação de texto/backup). Locais novos são criados antes.
  // A coluna "por" (quem cadastrou) o banco preenche sozinho com o email de quem está logado.
  const adicionarVarios = async (lista) => {
    const novos = [...new Set(lista.map((i) => i.local))].filter((n) => !locais.includes(n));
    if (novos.length) {
      const { error } = await criarLocais(novos);
      if (error) return setErro(error.message);
    }
    await exec(supabase.from('itens').insert(lista));
  };

  return {
    itens, locais, alerta, carregando, erro,

    adicionar: (item) => exec(supabase.from('itens').insert(item)),
    adicionarVarios,

    // delta = +1 / -1. Chegando a 0, o item é apagado.
    ajustar: (id, delta) => {
      const item = itens.find((x) => x.id === id);
      if (!item) return;
      const qtd = item.qtd + delta;
      return exec(qtd > 0
        ? supabase.from('itens').update({ qtd }).eq('id', id)
        : supabase.from('itens').delete().eq('id', id));
    },

    remover: (id) => exec(supabase.from('itens').delete().eq('id', id)),

    novoLocal: (nome) => exec(criarLocais([nome])),

    // Alerta fica só neste aparelho (localStorage).
    setAlerta: (n) => {
      const v = Math.max(1, Number(n) || 7);
      setAlertaEstado(v);
      try { localStorage.setItem(ALERTA_KEY, String(v)); } catch { /* sem storage */ }
    },

    // Importa um backup .json: cria os locais e adiciona os itens (sem apagar nada).
    importar: async (d) => {
      if (!Array.isArray(d?.itens) || !Array.isArray(d?.locais)) return;
      const extras = d.locais.filter((n) => !locais.includes(n));
      if (extras.length) await criarLocais(extras);
      await adicionarVarios(d.itens.map(({ nome, local, qtd, un, val }) => ({ nome, local, qtd, un: un || 'un', val })));
    },
  };
}
