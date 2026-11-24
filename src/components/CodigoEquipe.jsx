// Tela mostrada depois do login para quem ainda não é da equipe.
// O código é conferido no banco (função entrar_equipe); o app nunca vê o código certo.
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Campo, campo } from '../ui';

export default function CodigoEquipe({ onOk }) {
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    const { data, error } = await supabase.rpc('entrar_equipe', { codigo: codigo.trim() });
    if (error) setErro(error.message);
    else if (data) onOk();
    else setErro('Código incorreto.');
    setEnviando(false);
  };

  return (
    <main className="mx-auto max-w-sm px-3.5 pt-16">
      <h1 className="mb-2 font-cond text-5xl font-bold leading-none">Validade</h1>
      <p className="mb-4 text-mut">Sua conta foi criada. Digite o código da equipe para liberar o acesso.</p>
      <form onSubmit={enviar} className="grid gap-3 rounded-xl border border-line bg-surf p-4">
        <Campo label="Código da equipe">
          <input className={`${campo} w-full`} required autoComplete="off" value={codigo}
            onChange={(e) => setCodigo(e.target.value)} />
        </Campo>
        {erro && <p className="text-sm text-bad">{erro}</p>}
        <button type="submit" disabled={enviando}
          className="rounded-md bg-ink px-4 py-2.5 font-semibold text-inkx disabled:opacity-50">
          {enviando ? 'Verificando…' : 'Entrar na equipe'}
        </button>
        <button type="button" className="text-sm text-mut underline" onClick={() => supabase.auth.signOut()}>
          Sair
        </button>
      </form>
    </main>
  );
}
