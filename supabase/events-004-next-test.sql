-- Cambio 4 de la tabla events: evento "clic en siguiente test" (next_test_click)
-- desde la página de resultado. test_slug = test recomendado; session_id = el
-- resultado desde donde se hizo clic.
-- Se pega una sola vez en Supabase: SQL Editor -> New query -> Run, SIN
-- seleccionar texto. Se puede correr más de una vez sin problema.

alter table events drop constraint if exists events_event_check;
alter table events add constraint events_event_check check (
  event in (
    'test_started',
    'test_completed',
    'block_completed',
    'share_click',
    'shared_link_opened',
    'shared_link_cta_click',
    'next_test_click'
  )
);

notify pgrst, 'reload schema';
