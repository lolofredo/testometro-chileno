-- Tabla de eventos de medición (Testómetro Chileno).
-- Se pega una sola vez en Supabase: SQL Editor -> New query -> Run.
-- Esquema completo actual. Si la tabla ya existía antes del evento por
-- bloque, correr events-002-block.sql y events-003-origin.sql en vez de
-- este archivo.
-- Sin datos personales: ni nickname, ni respuestas. session_id es el código
-- aleatorio del resultado (el mismo de /results/<session_id>).

create table if not exists events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event text not null check (
    event in (
      'test_started',
      'test_completed',
      'block_completed',
      'share_click',
      'shared_link_opened',
      'shared_link_cta_click'
    )
  ),
  test_slug text not null check (test_slug ~ '^[a-z0-9-]{1,40}$'),
  session_id text check (session_id is null or char_length(session_id) <= 64),
  channel text check (
    channel is null or channel in ('whatsapp', 'native', 'x', 'copy', 'story')
  ),
  score integer check (score is null or score between 0 and 1000),
  from_share boolean not null default false,
  block smallint check (block is null or block between 1 and 50),
  source text check (source is null or source ~ '^[a-z0-9_-]{1,40}$'),
  campaign text check (campaign is null or campaign ~ '^[a-z0-9_-]{1,60}$')
);

create index if not exists events_created_at_idx on events (created_at);

alter table events enable row level security;
grant insert on table events to anon;

-- El sitio solo puede anotar eventos. Nadie puede leerlos con la clave
-- pública: los reportes se ven desde el panel de Supabase.
drop policy if exists "Anyone can insert events" on events;
create policy "Anyone can insert events"
  on events for insert
  to anon
  with check (true);
