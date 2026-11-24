// Decide o que mostrar: aviso de configuração, carregando, login, código da equipe ou o painel.
import CodigoEquipe from './components/CodigoEquipe';
import Login from './components/Login';
import { useMembro } from './hooks/useMembro';
import { useSessao } from './hooks/useSessao';
import { configurado } from './lib/supabase';
import Painel from './Painel';

export default function App() {
  const sessao = useSessao();
  const { membro, verificar } = useMembro(sessao);

  if (!configurado) {
    return <p className="p-6">Faltam VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY (veja o README).</p>;
  }
  if (sessao === undefined) return <p className="p-6 text-mut">Carregando…</p>;
  if (!sessao) return <Login />;
  if (membro === undefined) return <p className="p-6 text-mut">Carregando…</p>;
  if (!membro) return <CodigoEquipe onOk={verificar} />;

  // Mostro o nome digitado no cadastro; se não tiver, o email.
  return <Painel quem={sessao.user.user_metadata?.nome || sessao.user.email} />;
}
