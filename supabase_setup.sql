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
  expires_at timestamp with time zone default (timezone('utc'::text, now()) + interval '7 days') not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ofertas
  add column if not exists expires_at timestamp with time zone default (timezone('utc'::text, now()) + interval '7 days') not null;

create index if not exists ofertas_active_expires_at_idx
  on public.ofertas (expires_at)
  where ativo = true;

create or replace function public.sync_oferta_expiration()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  now_utc timestamptz := timezone('utc'::text, now());
begin
  if tg_op = 'INSERT' then
    if new.expires_at is null then
      new.expires_at := now_utc + interval '7 days';
    elsif new.ativo = true and new.expires_at <= now_utc then
      new.ativo := false;
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if coalesce(old.ativo, false) = false
       and new.ativo = true
       and (new.expires_at is null or new.expires_at <= now_utc) then
      new.expires_at := now_utc + interval '7 days';
    elsif new.ativo = true and new.expires_at is not null and new.expires_at <= now_utc then
      new.ativo := false;
    end if;
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_ofertas_sync_expiration on public.ofertas;
create trigger trg_ofertas_sync_expiration
  before insert or update on public.ofertas
  for each row
  execute function public.sync_oferta_expiration();

-- Ativar Row Level Security (RLS)
alter table public.ofertas enable row level security;

-- Remover políticas antigas caso re-execute o script
drop policy if exists "Leitura publica de ofertas" on public.ofertas;
drop policy if exists "Leitura anonima de ofertas ativas" on public.ofertas;
drop policy if exists "Lojista autenticado pode ler ofertas" on public.ofertas;
drop policy if exists "Lojista autenticado pode inserir ofertas" on public.ofertas;
drop policy if exists "Lojista autenticado pode atualizar ofertas" on public.ofertas;
drop policy if exists "Lojista autenticado pode excluir ofertas" on public.ofertas;

-- 1. Visitantes veem apenas ofertas ativas e dentro da validade de 7 dias
create policy "Leitura anonima de ofertas ativas"
  on public.ofertas for select
  to anon
  using (ativo = true and expires_at > timezone('utc'::text, now()));

-- Lojista autenticado visualiza todas (inclusive pausadas/expiradas)
create policy "Lojista autenticado pode ler ofertas"
  on public.ofertas for select
  to authenticated
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

-- Agendamento pg_cron para pausar automaticamente ofertas após 7 dias
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

do $$
declare
  existing_job_id bigint;
begin
  select jobid into existing_job_id
  from cron.job
  where jobname = 'pause-expired-ofertas';

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;
end $$;

select cron.schedule(
  'pause-expired-ofertas',
  '* * * * *',
  $$
  update public.ofertas
  set ativo = false,
      updated_at = timezone('utc'::text, now())
  where ativo = true
    and expires_at <= timezone('utc'::text, now());
  $$
);

