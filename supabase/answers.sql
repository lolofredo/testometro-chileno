-- Respuestas anónimas por pregunta, solo como contadores (Testómetro Chileno).
-- Se pega en Supabase: SQL Editor -> New query -> Run, SIN seleccionar texto.
-- Se puede correr más de una vez sin problema.
--
-- No se guarda ninguna fila por persona. Por test, versión, semana (lunes,
-- hora de Chile) y pregunta solo hay tres números: cuántos dijeron sí,
-- cuántos no y cuántos no respondieron. El sitio llama a record_answers()
-- al terminar un test y la base solo suma.
-- Necesita la tabla questions (questions.sql) para validar cada envío.

create table if not exists answer_counts (
  test_slug text not null check (test_slug ~ '^[a-z0-9-]{1,40}$'),
  test_version text not null check (test_version ~ '^[0-9a-z.-]{1,10}$'),
  week date not null,
  question smallint not null check (question between 1 and 200),
  yes_count integer not null default 0 check (yes_count >= 0),
  no_count integer not null default 0 check (no_count >= 0),
  blank_count integer not null default 0 check (blank_count >= 0),
  primary key (test_slug, test_version, week, question)
);

-- Nadie puede leer ni escribir la tabla con la clave pública: solo se suma a
-- través de record_answers(). Los reportes se ven desde el panel.
alter table answer_counts enable row level security;
revoke all on table answer_counts from anon, authenticated;

-- p_answers: una letra por pregunta en el orden del test: s = sí, n = no,
-- - = sin responder. Solo se acepta si el test y la versión existen en
-- questions y el largo calza con su número de preguntas.
create or replace function record_answers(
  p_test_slug text,
  p_test_version text,
  p_answers text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_week date := (date_trunc('week', now() at time zone 'America/Santiago'))::date;
  v_questions integer;
begin
  if p_test_slug is null or p_test_slug !~ '^[a-z0-9-]{1,40}$'
    or p_test_version is null or p_test_version !~ '^[0-9a-z.-]{1,10}$'
    or p_answers is null or p_answers !~ '^[sn-]{1,200}$' then
    raise exception 'invalid answers';
  end if;

  select count(*) into v_questions
  from questions
  where test_slug = p_test_slug and test_version = p_test_version;

  if v_questions = 0 or v_questions <> char_length(p_answers) then
    raise exception 'invalid answers';
  end if;

  insert into answer_counts (test_slug, test_version, week, question, yes_count, no_count, blank_count)
  select
    p_test_slug,
    p_test_version,
    v_week,
    i,
    (substr(p_answers, i, 1) = 's')::integer,
    (substr(p_answers, i, 1) = 'n')::integer,
    (substr(p_answers, i, 1) = '-')::integer
  from generate_series(1, char_length(p_answers)) as i
  on conflict (test_slug, test_version, week, question) do update set
    yes_count = answer_counts.yes_count + excluded.yes_count,
    no_count = answer_counts.no_count + excluded.no_count,
    blank_count = answer_counts.blank_count + excluded.blank_count;
end;
$$;

revoke all on function record_answers(text, text, text) from public, anon, authenticated;
grant execute on function record_answers(text, text, text) to anon;

notify pgrst, 'reload schema';
