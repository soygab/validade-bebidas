// Tela de login e de criar conta. Cada pessoa cria a própria conta (nome, email, senha).
// Quem pode ver os dados é decidido depois, pelo código da equipe (CodigoEquipe.jsx).
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Campo, campo } from '../ui';

export default function Login() {
  const [criar, setCriar] = useState(false); // false = entrar, true = criar conta
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    if (criar) {
      // O nome vai junto na conta (user_metadata.nome) e aparece nos itens cadastrados.
      const { data, error } = await supabase.auth.signUp({ email, password: senha, options: { data: { nome: nome.trim() } } });
      if (error) setErro(error.message);
      // Sem sessão = o Supabase ainda exige confirmar o email (desligue "Confirm email" no painel).
      else if (!data.session) setErro('Conta criada, mas o Supabase pediu confirmação por email. Desative "Confirm email" no painel ou confirme pelo email.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) setErro('Email ou senha incorretos.');
    }
    setEnviando(false);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-3.5">
      <form onSubmit={enviar} className="grid gap-3 rounded-xl border border-line bg-surf p-4">
        {criar && (
          <Campo label="Seu nome">
            <input className={`${campo} w-full`} required value={nome} onChange={(e) => setNome(e.target.value)} />
          </Campo>
        )}
        <Campo label="Email">
          <input className={`${campo} w-full`} type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </Campo>
        <Campo label="Senha">
          <input className={`${campo} w-full`} type="password" required minLength={6}
            autoComplete={criar ? 'new-password' : 'current-password'}
            value={senha} onChange={(e) => setSenha(e.target.value)} />
        </Campo>
        {erro && <p className="text-sm text-bad">{erro}</p>}
        <button type="submit" disabled={enviando}
          className="rounded-md bg-ink px-4 py-2.5 font-semibold text-inkx disabled:opacity-50">
          {enviando ? 'Aguarde…' : criar ? 'Criar conta' : 'Entrar'}
        </button>
        <button type="button" className="text-sm text-mut underline"
          onClick={() => { setCriar(!criar); setErro(''); }}>
          {criar ? 'Já tenho conta' : 'Criar conta'}
        </button>
      </form>
    </main>
  );
}
