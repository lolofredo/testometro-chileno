-- Cambio 2 de la tabla events: evento por bloque terminado.
-- Se pega una sola vez en Supabase: SQL Editor -> New query -> Run.
-- Se puede correr más de una vez sin problema.

alter table events drop constraint if exists events_event_check;
alter table events add constraint events_event_check check (
  event in (
    'test_started',
    'test_completed',
    'block_completed',
    'share_click',
    'shared_link_opened',
    'shared_link_cta_click'
  )
);

alter table events add column if not exists block smallint check (
  block is null or block between 1 and 50
);
