// Diz quem está logado. Valores: undefined = ainda carregando, null = ninguém logado, objeto = logado.
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSessao() {
  const [sessao, setSessao] = useState(undefined);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSessao(data.session));
    // Atualiza sozinho quando eu entro ou saio
    const { data } = supabase.auth.onAuthStateChange((_evento, s) => setSessao(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return sessao;
}
