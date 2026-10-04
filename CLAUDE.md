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
  - `tests.ts`: lista de tests jugables (rutas, sitemap, rankings)
  - `test-catalog.ts`: tarjetas del catálogo
  - `memes.ts` + `public/memes/`: memes
- El **Chantómetro** ("próximamente") no es un test: es una tarjeta escrita a mano en `homeTests` de `src/app/page.tsx`.
- Para agregar un test: crear `src/data/<slug>.ts` con un `TestDefinition` (ver `src/lib/tests/types.ts`) y registrarlo en `tests.ts` y `test-catalog.ts`.
- `src/components/test/`: StartForm, TestPlayer, QuestionRow, ResultView/ResultCard, RankingView.
- `src/lib/tests/`: puntaje (`scoring.ts`), guardado en navegador (`storage.ts`), tipos.
- `src/lib/supabase/`: cliente y ranking remoto. `src/lib/seo.ts`: metadatos y JSON-LD.
- `supabase/production-ranking.sql`: tabla `leaderboard_entries` (la única que usa la app). `schema.sql` incluye tablas que nunca se conectaron.
- Ignorar: `Archivo/` (copia antigua), `exports/` (imágenes de redes), `*.zip`.

## Resultados y ranking
- Progreso, resultados y ranking local viven en `localStorage` (`testometro:session:*`, `testometro:active:*`, `testometro:leaderboard:*`). Los links `/results/...` solo funcionan en el navegador donde se hizo el test.
- Resultado compartible: `/r/<test>/<token>`. El token lleva test, puntaje y nickname dentro del link (sin base de datos, funciona aunque Supabase esté caído); nunca las respuestas. Código en `src/lib/share/` (`result-link.ts` arma y lee el link; `nickname.ts` filtra insultos, links y caracteres raros, y deja máximo 20 caracteres; `share-copy.ts` tiene los textos de invitación por test). La imagen de vista previa sale de `src/app/r/[slug]/[token]/og/route.tsx` (1200×630, unos 70 KB). Las páginas `/r/` llevan noindex (meta + cabecera en `next.config.ts`) y **no** se bloquean en robots.txt, porque X dejaría de mostrar la vista previa.
- Ranking global: Supabase, tabla `leaderboard_entries`, leída y escrita desde el navegador con la clave pública. Se escribe solo si la persona marca "Aparecer en ranking público".
- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, opcional `NEXT_PUBLIC_SITE_URL`. Quedan fijas al compilar: si cambian en Vercel, hay que redesplegar.
- Supabase gratis se pausa tras 7 días sin actividad: `vercel.json` programa un Vercel Cron diario a `/api/keepalive` (`src/app/api/keepalive/route.ts`), que hace una consulta mínima a `leaderboard_entries`. Abrir https://testometro.cl/api/keepalive debe responder `{"ok":true,...}`.
- Si faltan o Supabase no responde, la app vuelve sin aviso al ranking local ("Ranking local de este navegador…").
- Riesgo conocido: cualquiera puede insertar puntajes o nicknames falsos (sin validación ni límite de envíos).
