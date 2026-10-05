-- Cambio 5 de la tabla events: formato de preguntas de la prueba A/B
-- ('una' = una por pantalla, 'bloques' = bloques de 10), en test_started,
-- test_completed y block_completed.
-- Se pega una sola vez en Supabase: SQL Editor -> New query -> Run, SIN
-- seleccionar texto (si hay algo seleccionado, Supabase corre solo eso).
-- Se puede correr más de una vez sin problema.

alter table events add column if not exists format text check (
  format is null or format in ('una', 'bloques')
);

notify pgrst, 'reload schema';
