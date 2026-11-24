// Conexão com o Supabase (o banco compartilhado da equipe).
// URL e chave vêm do arquivo .env.local (no PC) ou das Variables do GitHub Actions (no deploy).
// A chave "publishable" é pública por natureza; quem protege os dados é o login + as regras (RLS) do supabase/schema.sql.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const configurado = Boolean(url && key);
export const supabase = configurado ? createClient(url, key) : null;
