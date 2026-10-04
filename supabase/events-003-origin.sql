-- Cambio 3 de la tabla events: origen de la visita en test_started y
-- test_completed. Se pega una sola vez en Supabase: SQL Editor -> New query
-- -> Run, SIN seleccionar texto (si hay algo seleccionado, Supabase corre
-- solo eso). Se puede correr más de una vez sin problema.

alter table events add column if not exists source text check (
  source is null or source ~ '^[a-z0-9_-]{1,40}$'
);

alter table events add column if not exists campaign text check (
  campaign is null or campaign ~ '^[a-z0-9_-]{1,60}$'
);

notify pgrst, 'reload schema';
