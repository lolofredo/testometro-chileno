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

-- 5. Por origen y campaña: de dónde llegó la gente que empezó un test.
-- "sin dato" = tests empezados antes de medir el origen (2026-10-04).
with empezados as (
  select session_id, coalesce(source, 'sin dato') as origen, coalesce(campaign, '-') as campana
  from events
  where event = 'test_started' and created_at > now() - interval '30 days'
)
select
  origen,
  campana,
  count(*) as empezaron,
  count(*) filter (
    where exists (select 1 from events c where c.session_id = e.session_id and c.event = 'test_completed')
  ) as terminaron,
  round(
    100.0 * count(*) filter (
      where exists (select 1 from events c where c.session_id = e.session_id and c.event = 'test_completed')
    ) / nullif(count(*), 0),
    1
  ) as pct_terminan,
  count(*) filter (
    where exists (select 1 from events s where s.session_id = e.session_id and s.event = 'share_click')
  ) as compartieron
from empezados e
group by origen, campana
order by empezaron desc;

-- 6. Siguiente test: desde el resultado de cada test, cuántas personas
-- tocaron la tarjeta "Siguiente test" y hacia cuál.
select
  coalesce(origen.test_slug, '?') as desde,
  e.test_slug as hacia,
  count(distinct e.session_id) as personas,
  round(
    100.0 * count(distinct e.session_id) / nullif(max(t.terminados), 0),
    1
  ) as pct_de_los_que_terminaron
from events e
left join lateral (
  select s.test_slug from events s
  where s.session_id = e.session_id and s.event = 'test_completed'
  limit 1
) origen on true
left join (
  select test_slug, count(distinct session_id) as terminados
  from events
  where event = 'test_completed' and created_at > now() - interval '30 days'
  group by test_slug
) t on t.test_slug = origen.test_slug
where e.event = 'next_test_click'
  and e.created_at > now() - interval '30 days'
group by 1, 2
order by personas desc;

-- 7. Prueba A/B del formato de preguntas: "una" (una por pantalla) contra
-- "bloques" (bloques de 10). Solo Chantómetro, Cuicómetro y Rotómetro 2.0
-- (el Original siempre va en bloques). Cuenta desde que existe la columna
-- format; no cambiar el período mientras dure la prueba.
-- "diferencia_clara": "sí" cuando la diferencia es difícil que sea suerte
-- (95% de confianza) y cada formato tiene al menos 100 personas que
-- empezaron (o 50 que terminaron, para compartir).
with empezados as (
  select distinct on (session_id) session_id, format
  from events
  where event = 'test_started' and format is not null and test_slug <> 'rotometro-original'
  order by session_id, created_at
),
por_formato as (
  select
    e.format,
    count(*) as empezaron,
    count(*) filter (
      where exists (select 1 from events c where c.session_id = e.session_id and c.event = 'test_completed')
    ) as terminaron,
    count(*) filter (
      where exists (select 1 from events s where s.session_id = e.session_id and s.event = 'share_click')
    ) as compartieron
  from empezados e
  group by e.format
),
una as (select * from por_formato where format = 'una'),
bloques as (select * from por_formato where format = 'bloques'),
pruebas as (
  select
    'terminan' as que,
    u.empezaron as base_una, u.terminaron as si_una,
    b.empezaron as base_bloques, b.terminaron as si_bloques,
    100 as minimo
  from una u, bloques b
  union all
  select
    'comparten (de los que terminan)',
    u.terminaron, u.compartieron,
    b.terminaron, b.compartieron,
    50
  from una u, bloques b
)
select
  que,
  base_una,
  round(100.0 * si_una / nullif(base_una, 0), 1) as pct_una,
  base_bloques,
  round(100.0 * si_bloques / nullif(base_bloques, 0), 1) as pct_bloques,
  case
    when base_una < minimo or base_bloques < minimo then 'todavía no: faltan datos'
    when abs(
      (si_una::numeric / base_una - si_bloques::numeric / base_bloques)
      / nullif(sqrt(
          ((si_una + si_bloques)::numeric / (base_una + base_bloques))
          * (1 - (si_una + si_bloques)::numeric / (base_una + base_bloques))
          * (1.0 / base_una + 1.0 / base_bloques)
        ), 0)
    ) >= 1.96 then 'sí'
    else 'no'
  end as diferencia_clara
from pruebas;

-- 8. Abandono por bloque según formato (misma prueba A/B).
with empezados as (
  select format, count(distinct session_id) as personas
  from events
  where event = 'test_started' and format is not null and test_slug <> 'rotometro-original'
  group by format
)
select
  e.format as formato,
  e.block as bloque,
  count(distinct e.session_id) as terminaron_bloque,
  round(100.0 * count(distinct e.session_id) / nullif(max(s.personas), 0), 1) as pct_de_los_que_empezaron
from events e
join empezados s on s.format = e.format
where e.event = 'block_completed' and e.format is not null and e.test_slug <> 'rotometro-original'
group by e.format, e.block
order by e.format, e.block;
