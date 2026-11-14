-- ============================================================================
-- BELA ALIANÇA ELÉTRICA E HIDRÁULICA — TABELA DE OFERTAS DA SEMANA
-- ============================================================================

create table if not exists public.ofertas (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  categoria text not null default 'eletrica',
  subcategoria text default '',
  preco_antigo numeric(10,2) default 0,
  preco_novo numeric(10,2) not null,
  observacao text default 'À vista no PIX ou Dinheiro',
  selo text default '',
  selo_destaque boolean default false,
  imagem text default 'assets/img/post-tinta-emborrachada.jpg',
  ativo boolean default true,
  destaque boolean default false,
  ordem integer default 999,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ofertas enable row level security;

drop policy if exists "Leitura publica de ofertas" on public.ofertas;
drop policy if exists "Lojista autenticado pode inserir ofertas" on public.ofertas;
drop policy if exists "Lojista autenticado pode atualizar ofertas" on public.ofertas;
drop policy if exists "Lojista autenticado pode excluir ofertas" on public.ofertas;

create policy "Leitura publica de ofertas"
  on public.ofertas for select
  using (true);

create policy "Lojista autenticado pode inserir ofertas"
  on public.ofertas for insert
  to authenticated
  with check (true);

create policy "Lojista autenticado pode atualizar ofertas"
  on public.ofertas for update
  to authenticated
  using (true)
  with check (true);

create policy "Lojista autenticado pode excluir ofertas"
  on public.ofertas for delete
  to authenticated
  using (true);

do $$
begin
  alter publication supabase_realtime add table public.ofertas;
exception when others then
  null;
end $$;

