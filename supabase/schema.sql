-- Rodar UMA vez no Supabase: SQL Editor -> New query -> colar tudo -> Run.

create table public.locais (
  nome text primary key
);

create table public.itens (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  local text not null,
  qtd int not null check (qtd > 0),
  un text not null default 'un',
  val date not null,
  -- quem cadastrou: o banco preenche sozinho com o email de quem está logado
  por text default (auth.jwt() ->> 'email'),
  criado_em timestamptz not null default now()
);

-- Só gente logada mexe nos dados. Quem não está logado não vê nada.
alter table public.itens enable row level security;
alter table public.locais enable row level security;

revoke all on public.itens, public.locais from anon;
grant select, insert, update, delete on public.itens, public.locais to authenticated;

create policy "equipe itens" on public.itens
  for all to authenticated using (true) with check (true);
create policy "equipe locais" on public.locais
  for all to authenticated using (true) with check (true);

-- Locais iniciais (troque pelos seus)
insert into public.locais (nome) values
  ('Câmara fria'), ('Geladeira 1'), ('Geladeira 2'), ('Geladeira 3');

-- Atualização ao vivo entre os aparelhos da equipe
alter publication supabase_realtime add table public.itens, public.locais;
