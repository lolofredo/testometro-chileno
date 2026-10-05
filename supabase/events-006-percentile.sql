-- Cambio 6: comparación "Más chanta que el X%" en el resultado.
-- Función que devuelve solo un porcentaje: de las personas que terminaron
-- ese test, qué porcentaje sacó menos puntaje. Nunca devuelve filas ni
-- puntajes de nadie, y devuelve vacío (no se muestra nada) mientras el test
-- tenga menos de 50 resultados.
-- Se pega una sola vez en Supabase: SQL Editor -> New query -> Run, SIN
-- seleccionar texto. Se puede correr más de una vez sin problema.

create or replace function score_percentile(p_test_slug text, p_score integer)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  with terminados as (
    select distinct on (session_id) score
    from events
    where event = 'test_completed'
      and test_slug = p_test_slug
      and session_id is not null
      and score is not null
    order by session_id, created_at
  )
  select case
    when count(*) >= 50
      then floor(100.0 * count(*) filter (where score < p_score) / count(*))::integer
  end
  from terminados;
$$;

revoke all on function score_percentile(text, integer) from public, anon, authenticated;
grant execute on function score_percentile(text, integer) to anon;

notify pgrst, 'reload schema';
