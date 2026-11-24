// Diz se a pessoa logada já entrou na equipe (digitou o código certo).
// undefined = verificando | true = é da equipe | false = ainda precisa do código.
// "verificar" eu chamo de novo depois que a pessoa digita o código.
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useMembro(sessao) {
  const [membro, setMembro] = useState(undefined);

  const verificar = useCallback(async () => {
    // O banco só devolve a linha se for a da própria pessoa (regra no 2-equipe-com-codigo.sql)
    const { data, error } = await supabase.from('membros').select('user_id').maybeSingle();
    setMembro(!error && !!data);
  }, []);

  useEffect(() => {
    if (sessao) verificar(); else setMembro(undefined);
  }, [sessao?.user?.id, verificar]);

  return { membro, verificar };
}
