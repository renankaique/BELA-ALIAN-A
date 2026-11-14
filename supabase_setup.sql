-- ============================================================================
-- BELA ALIANÇA ELÉTRICA E HIDRÁULICA — CRIAÇÃO DA TABELA NO SUPABASE
-- Execute este script no "SQL Editor" do painel do Supabase (apenas 1 vez).
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

-- Ativar Row Level Security (RLS)
alter table public.ofertas enable row level security;

-- Remover políticas antigas caso re-execute o script
drop policy if exists "Leitura publica de ofertas" on public.ofertas;
drop policy if exists "Lojista autenticado pode inserir ofertas" on public.ofertas;
drop policy if exists "Lojista autenticado pode atualizar ofertas" on public.ofertas;
drop policy if exists "Lojista autenticado pode excluir ofertas" on public.ofertas;

-- 1. Qualquer visitante do site pode LER as ofertas
create policy "Leitura publica de ofertas"
  on public.ofertas for select
  using (true);

-- 2. Apenas o lojista logado (Supabase Auth) pode ADICIONAR, EDITAR e EXCLUIR
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

-- Opcional: ativa atualização em tempo real na vitrine
do $$
begin
  alter publication supabase_realtime add table public.ofertas;
exception when others then
  null;
end $$;

