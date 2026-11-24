-- Rodar DEPOIS do schema.sql (SQL Editor -> New query -> Run).
-- Cada pessoa cria a própria conta no app e entra na equipe digitando um CÓDIGO.
-- Sem o código, a conta existe mas não vê nem altera nada.

-- 1) Quem já entrou na equipe
create table public.membros (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.membros enable row level security;
revoke all on public.membros from anon, authenticated;
grant select on public.membros to authenticated;
create policy "ver propria linha" on public.membros
  for select to authenticated using (user_id = (select auth.uid()));

-- 2) O código da equipe (ninguém consegue ler isto pelo app)
--    >>> TROQUE 'TROQUE-ESTE-CODIGO' por um código LONGO (12+ caracteres) <<<
create table public.config (chave text primary key, valor text not null);
alter table public.config enable row level security;
revoke all on public.config from anon, authenticated;
insert into public.config values ('codigo_equipe', 'TROQUE-ESTE-CODIGO');

-- 3) Confere o código e registra a pessoa como membro
create or replace function public.entrar_equipe(codigo text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  if codigo is distinct from (select valor from config where chave = 'codigo_equipe') then return false; end if;
  insert into membros (user_id) values (auth.uid()) on conflict do nothing;
  return true;
end $$;
revoke all on function public.entrar_equipe(text) from public, anon;
grant execute on function public.entrar_equipe(text) to authenticated;

-- 4) Só membros acessam itens e locais
drop policy "equipe itens" on public.itens;
drop policy "equipe locais" on public.locais;
create policy "membros itens" on public.itens for all to authenticated
  using (exists (select 1 from public.membros m where m.user_id = (select auth.uid())))
  with check (exists (select 1 from public.membros m where m.user_id = (select auth.uid())));
create policy "membros locais" on public.locais for all to authenticated
  using (exists (select 1 from public.membros m where m.user_id = (select auth.uid())))
  with check (exists (select 1 from public.membros m where m.user_id = (select auth.uid())));

-- 5) "por" passa a guardar o NOME digitado no cadastro (ou o email, se não tiver nome)
alter table public.itens alter column por
  set default coalesce(auth.jwt() -> 'user_metadata' ->> 'nome', auth.jwt() ->> 'email');

-- 6) Contas que já existem (as que você criou na mão) viram membros
insert into public.membros (user_id) select id from auth.users on conflict do nothing;
