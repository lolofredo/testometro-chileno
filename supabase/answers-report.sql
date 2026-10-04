-- Reportes de respuestas anónimas (contadores). Pegar en Supabase:
-- SQL Editor -> New query -> Run, SIN seleccionar texto.
-- Necesita answer_counts (answers.sql) y questions (questions.sql).

-- 1. Por test y pregunta: cuántos respondieron y qué % dijo "sí" (sobre
-- quienes respondieron esa pregunta). "pocas respuestas" = menos de 30:
-- no publicar ese porcentaje.
select
  q.test_slug as test,
  q.number as n,
  q.text as pregunta,
  coalesce(sum(c.yes_count + c.no_count), 0) as respondieron,
  round(100.0 * sum(c.yes_count) / nullif(sum(c.yes_count + c.no_count), 0), 1) as pct_si,
  coalesce(sum(c.blank_count), 0) as sin_responder,
  case
    when coalesce(sum(c.yes_count + c.no_count), 0) < 30 then 'pocas respuestas'
    else 'ok'
  end as muestra
from questions q
left join answer_counts c
  on c.test_slug = q.test_slug
  and c.test_version = q.test_version
  and c.question = q.number
-- Para un período: and c.week >= date '2026-10-05'
group by q.test_slug, q.number, q.text
order by q.test_slug, q.number;

-- 2. Control de respuestas falsas: por test y semana, envíos de respuestas
-- contra tests terminados registrados en events. Si los envíos superan
-- claramente a los terminados, alguien pudo mandar respuestas falsas; esa
-- semana de ese test se puede borrar completa (ver CLAUDE.md).
with envios as (
  select test_slug, week, sum(yes_count + no_count + blank_count) as envios
  from answer_counts
  where question = 1
  group by test_slug, week
),
terminados as (
  select
    test_slug,
    (date_trunc('week', created_at at time zone 'America/Santiago'))::date as week,
    count(*) as terminados
  from events
  where event = 'test_completed'
  group by 1, 2
)
select
  e.test_slug as test,
  e.week as semana,
  e.envios,
  coalesce(t.terminados, 0) as terminados,
  case when e.envios > coalesce(t.terminados, 0) + 5 then 'revisar' else 'ok' end as control
from envios e
left join terminados t on t.test_slug = e.test_slug and t.week = e.week
order by e.week desc, e.test_slug;
