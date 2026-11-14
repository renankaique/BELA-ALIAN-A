-- ============================================================================
-- BELA ALIANÇA ELÉTRICA E HIDRÁULICA — EXPIRAÇÃO AUTOMÁTICA EM 7 DIAS
-- Pausa automaticamente qualquer promoção após 1 semana (7 dias)
-- ============================================================================

alter table public.ofertas
  add column if not exists expires_at timestamptz not null
  default (timezone('utc'::text, now()) + interval '7 days');

update public.ofertas
set expires_at = greatest(
  coalesce(updated_at, created_at),
  coalesce(created_at, timezone('utc'::text, now()))
) + interval '7 days';

-- Índice parcial para acelerar verificação de ofertas ativas prestes a expirar
create index if not exists ofertas_active_expires_at_idx
  on public.ofertas (expires_at)
  where ativo = true;

-- Trigger para iniciar contagem de 7 dias ao ativar e impedir expirada ativa
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

-- Políticas RLS: visitantes veem apenas ofertas ativas e dentro do prazo de 7 dias
drop policy if exists "Leitura publica de ofertas" on public.ofertas;
drop policy if exists "Leitura anonima de ofertas ativas" on public.ofertas;
drop policy if exists "Lojista autenticado pode ler ofertas" on public.ofertas;

create policy "Leitura anonima de ofertas ativas"
  on public.ofertas for select
  to anon
  using (ativo = true and expires_at > timezone('utc'::text, now()));

create policy "Lojista autenticado pode ler ofertas"
  on public.ofertas for select
  to authenticated
  using (true);

-- Agendamento pg_cron para pausar no banco a cada minuto ofertas com prazo vencido
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
