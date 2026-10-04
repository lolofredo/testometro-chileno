# Testómetro Chileno — guía para Claude

Sitio https://testometro.cl: tests de humor y cultura popular chilena. Next.js 16 (App Router) + React 19 + Tailwind 3, publicado en Vercel desde GitHub (`lolofredo/testometro-chileno`, repo público). Construido en parte con Codex.

## Flujo de trabajo (obligatorio)
- Se trabaja directo en `main`, que es producción. Sin ramas aparte ni pull requests.
- Antes de cada commit: explicar a Juan en lenguaje simple qué cambia y por qué, y esperar su confirmación explícita. Juan no revisa diffs.
- Antes de pedir confirmación, verificar que compila: `npm run lint && npm run typecheck && npm run build`.
- Con la confirmación: commit y push. Push = despliegue automático a producción.
- Nunca hacer push sin confirmación, ni siquiera para cambios pequeños. Nunca push forzado.
- Antes de hacer push: `git fetch` y revisar que GitHub no tenga commits que falten en local (a veces se suben archivos desde la web de GitHub). Si los hay, avisar antes de seguir.

## Reglas del proyecto
- **El Rotómetro Original es intocable** (`src/data/rotometro-original.ts`, el archivo completo): no modificar, corregir, suavizar ni reordenar preguntas, categorías, puntajes ni textos, aunque tengan errores o lenguaje de época.
- Nada con costo sin preguntar: ni planes pagados, ni servicios nuevos, ni dependencias de pago.
- No mostrar en el chat valores de claves ni de archivos `.env`; solo nombrar las variables.
- Títulos de página: el layout ya agrega " | Testómetro Chileno"; no repetirlo en el `title` de cada página.

## Comandos
- `npm run dev`: desarrollo local (http://localhost:3000)
- `npm run build`: build de producción (`next build --webpack`)
- `npm run lint` / `npm run typecheck`
- Node 22.

## Estructura
- `src/app/`: páginas. `/`, `/tests`, `/tests/[slug]` (portada), `/tests/[slug]/start` (nickname + opción de ranking), `/tests/[slug]/play` (bloques de 10 preguntas), `/results/[sessionId]`, `/r/[slug]/[token]` (resultado público compartible), `/rankings` (todos los rankings en una página; `/rankings/[slug]` redirige ahí), `/memes`, `/about`, `sitemap.ts`, `robots.ts`.
- `src/data/`: contenido de cada test, un archivo por test:
  - `rotometro-original.ts`: 150 preguntas (intocable)
  - `rotometro-2.ts`: 50 preguntas
  - `cuicometro.ts`: 50 preguntas
  - `chantometro.ts`: 50 preguntas (publicado el 2026-10-04; en el catálogo con etiqueta "Nuevo", que lo pone primero en la home)
  - `tests.ts`: lista de tests jugables (rutas, sitemap, rankings)
  - `test-catalog.ts`: tarjetas del catálogo
  - `memes.ts` + `public/memes/`: memes
- La home (`homeTests` en `src/app/page.tsx`) muestra el catálogo con los tests de etiqueta "Nuevo" primero, y el botón "Empezar ahora" lleva al test "Nuevo" (si no hay, al Cuicómetro: según Search Console es el que más tráfico trae de Google; el Original es el que menos). Ya no hay tarjetas escritas a mano.
- Para agregar un test: crear `src/data/<slug>.ts` con un `TestDefinition` (ver `src/lib/tests/types.ts`), registrarlo en `tests.ts` y `test-catalog.ts`, agregar su invitación en `src/lib/share/share-copy.ts` y su nombre en las palabras clave/descripciones (`src/lib/seo.ts`, home, `/tests`, `/rankings`). Supabase no necesita cambios: `leaderboard_entries` y `events` aceptan cualquier slug en minúsculas.
- `src/components/test/`: StartForm, TestPlayer, QuestionRow, ResultView/ResultCard, RankingView.
- `src/lib/tests/`: puntaje (`scoring.ts`), guardado en navegador (`storage.ts`), tipos.
- `src/lib/supabase/`: cliente y ranking remoto. `src/lib/seo.ts`: metadatos y JSON-LD.
- `supabase/production-ranking.sql`: tabla `leaderboard_entries` (la única que usa la app). `schema.sql` incluye tablas que nunca se conectaron.
- Ignorar: `Archivo/` (copia antigua), `exports/` (imágenes de redes), `*.zip`.

## Resultados y ranking
- Progreso, resultados y ranking local viven en `localStorage` (`testometro:session:*`, `testometro:active:*`, `testometro:leaderboard:*`). Los links `/results/...` solo funcionan en el navegador donde se hizo el test.
- Resultado compartible: `/r/<test>/<token>`. El token lleva test, puntaje y nickname dentro del link (sin base de datos, funciona aunque Supabase esté caído); nunca las respuestas. Código en `src/lib/share/` (`result-link.ts` arma y lee el link; `nickname.ts` filtra insultos, links y caracteres raros, y deja máximo 20 caracteres; `share-copy.ts` tiene los textos de invitación por test y arma el texto para compartir: los tests de `testsWithSharePhrases` (Rotómetro 2.0, Cuicómetro y Chantómetro; el Original no) usan la frase `shareText` de su grupo; los demás, "Me salió «grupo» (N pts)". Las frases van solo en el texto, no en las imágenes). Imágenes en `src/lib/share/result-image.tsx`: vista previa `/r/.../og` (1200×630, unos 55 KB) e imagen para historia de Instagram `/r/.../historia` (1080×1920, unos 100 KB), con la fuente Archivo Black (licencia OFL) en `src/lib/share/fonts/`, incluida en la función vía `outputFileTracingIncludes` de `next.config.ts`. Las páginas `/r/` llevan noindex (meta + cabecera en `next.config.ts`) y **no** se bloquean en robots.txt, porque X dejaría de mostrar la vista previa.
- Ranking global: Supabase, tabla `leaderboard_entries`, leída y escrita desde el navegador con la clave pública. Se escribe solo si la persona marca "Aparecer en ranking público".
- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, opcional `NEXT_PUBLIC_SITE_URL`. Quedan fijas al compilar: si cambian en Vercel, hay que redesplegar.
- Supabase gratis se pausa tras 7 días sin actividad: `vercel.json` programa un Vercel Cron diario a `/api/keepalive` (`src/app/api/keepalive/route.ts`), que hace una consulta mínima a `leaderboard_entries`. Abrir https://testometro.cl/api/keepalive debe responder `{"ok":true,...}`.
- Si faltan o Supabase no responde, la app vuelve sin aviso al ranking local ("Ranking local de este navegador…").
- Medición: tabla `events` en Supabase (crearla con `supabase/events.sql`; reportes en `supabase/events-report.sql`, se pegan en SQL Editor). El navegador solo puede insertar (no leer). Eventos: `test_started`, `test_completed` (con puntaje), `share_click` (con canal), `shared_link_opened`, `shared_link_cta_click`, `block_completed` (columna `block`, desde 1; se anota al tocar "Siguiente bloque" o "Ver resultado", aunque no se hayan respondido todas; columna agregada con `supabase/events-002-block.sql`, ya aplicado en producción el 2026-10-04); `from_share` marca tests empezados hasta 24 h después de tocar la invitación de un resultado compartido. Código en `src/lib/analytics/events.ts`. Origen de la visita (`source`, `campaign`, solo en `test_started`/`test_completed`; columnas de `supabase/events-003-origin.sql`): `src/lib/analytics/origin.ts` lo fija al entrar al sitio (`VisitOriginTracker` en el layout, sessionStorage de la pestaña); `utm_source`/`utm_campaign` mandan, si no se deduce de la página anterior (google, bing, instagram, facebook, whatsapp, x, tiktok, chatgpt, otro, directo). Se guarda en la sesión del test al empezar. Nunca se guarda la dirección completa. Sin nickname ni respuestas. Si Supabase falla, el evento se pierde sin afectar el sitio.
- Respuestas anónimas, solo como contadores: tabla `answer_counts` (`supabase/answers.sql`), sin filas por persona. Por test, versión, semana (lunes, hora de Chile) y pregunta guarda cuántos dijeron sí, no y sin responder. Al tocar "Ver resultado" la primera vez, `src/lib/analytics/answers.ts` llama a la función `record_answers()` con una letra por pregunta en orden (`s`, `n`, `-`); la base valida contra `questions` (test, versión y largo) y suma. Nadie puede leer ni escribir la tabla con la clave pública. Textos: tabla `questions`, generada con `node --experimental-strip-types scripts/generate-questions-sql.mjs` → `supabase/questions.sql`; **volver a generarla y pegarla en Supabase cada vez que cambien preguntas o la `version` de un test** (y subir la `version` si cambia el sentido de una pregunta, para no mezclar contadores). Reportes en `supabase/answers-report.sql` (marca "pocas respuestas" bajo 30; control envíos vs. tests terminados). Si una semana de un test se ve contaminada con respuestas falsas: `delete from answer_counts where test_slug = '…' and week = '…';`. Aviso al usuario bajo "Empezar test" (`StartForm`) y en `/about`; publicar solo totales.
- Riesgo conocido: cualquiera puede insertar filas directo en la tabla con la clave pública (sin validación ni límite de envíos). Por eso `RankingView` limpia al mostrar: nickname con el mismo filtro de `src/lib/share/nickname.ts` (máximo 32 caracteres), sin puntajes imposibles para el test (también filtrados en la consulta) y con el grupo calculado desde el puntaje, no el guardado. Al guardar, `TestPlayer` también limpia el nickname.
- `Archivo/` está excluido de `tsconfig.json` y de ESLint (es una copia vieja sin subir que rompía el typecheck local).
