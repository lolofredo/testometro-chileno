-- Reportes de eventos. Pegar en Supabase: SQL Editor -> New query -> Run.
-- Cambiar '30 days' por el período que se quiera mirar.

-- 1. Embudo por test.
select
  test_slug as test,
  count(distinct session_id) filter (where event = 'test_started') as empezaron,
  count(distinct session_id) filter (where event = 'test_completed') as terminaron,
  round(
    100.0 * count(distinct session_id) filter (where event = 'test_completed')
      / nullif(count(distinct session_id) filter (where event = 'test_started'), 0),
    1
  ) as pct_terminan,
  count(distinct session_id) filter (where event = 'share_click') as compartieron,
  round(
    100.0 * count(distinct session_id) filter (where event = 'share_click')
      / nullif(count(distinct session_id) filter (where event = 'test_completed'), 0),
    1
  ) as pct_comparten,
  count(*) filter (where event = 'shared_link_opened') as links_abiertos,
  count(*) filter (where event = 'shared_link_cta_click') as clics_en_invitacion,
  count(distinct session_id) filter (where event = 'test_started' and from_share) as empezaron_desde_link,
  count(distinct session_id) filter (where event = 'test_completed' and from_share) as terminaron_desde_link
from events
where created_at > now() - interval '30 days'
group by test_slug
order by test_slug;

-- 2. Por dónde se comparte (personas distintas por canal).
select
  test_slug as test,
  channel as canal,
  count(distinct session_id) as personas,
  count(*) as clics
from events
where event = 'share_click'
  and created_at > now() - interval '30 days'
group by test_slug, channel
order by test_slug, personas desc;

-- 3. Por día (todos los tests).
select
  date_trunc('day', created_at at time zone 'America/Santiago')::date as dia,
  count(distinct session_id) filter (where event = 'test_started') as empezaron,
  count(distinct session_id) filter (where event = 'test_completed') as terminaron,
  count(distinct session_id) filter (where event = 'share_click') as compartieron,
  count(*) filter (where event = 'shared_link_opened') as links_abiertos
from events
where created_at > now() - interval '30 days'
group by 1
order by 1 desc;

-- 4. Abandono por bloque: cuántas personas terminaron cada bloque de cada test.
-- (Cada bloque son 10 preguntas; el Rotómetro Original tiene 15 bloques.)
with empezaron as (
  select test_slug, count(distinct session_id) as personas
  from events
  where event = 'test_started' and created_at > now() - interval '30 days'
  group by test_slug
)
select
  e.test_slug as test,
  e.block as bloque,
  count(distinct e.session_id) as terminaron_bloque,
  round(100.0 * count(distinct e.session_id) / nullif(max(s.personas), 0), 1) as pct_de_los_que_empezaron
from events e
left join empezaron s on s.test_slug = e.test_slug
where e.event = 'block_completed'
  and e.created_at > now() - interval '30 days'
group by e.test_slug, e.block
order by e.test_slug, e.block;
