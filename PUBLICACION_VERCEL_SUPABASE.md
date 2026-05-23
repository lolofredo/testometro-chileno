# Publicar Testómetro Chileno

## Estado actual

La app ya esta lista para publicar en Vercel:

- Build de produccion OK.
- TypeScript OK.
- Lint OK.
- `npm audit --omit=dev` sin vulnerabilidades.
- Ranking local funcionando.
- Ranking global preparado para Supabase.

## Que resuelve Supabase

Sin Supabase, el ranking vive solo en el navegador de cada persona.

Con Supabase, el ranking pasa a ser global:

- todos los usuarios ven el mismo ranking;
- cada resultado publico se guarda en la nube;
- no se guardan respuestas individuales en esta V1;
- solo se guarda nickname, puntaje, grupo, fecha y test.

## Paso 1 - Crear proyecto en Supabase

1. Entrar a Supabase.
2. Crear un nuevo proyecto.
3. Ir a **SQL Editor**.
4. Ejecutar el contenido de:

```text
supabase/production-ranking.sql
```

Ese script crea la tabla publica del ranking y sus permisos basicos.

## Paso 2 - Obtener credenciales publicas

En Supabase:

1. Ir a **Project Settings**.
2. Ir a **API**.
3. Copiar:
   - Project URL
   - anon public key

No uses la `service_role key` en Vercel ni en el frontend.

## Paso 3 - Configurar Vercel

En Vercel, dentro del proyecto:

1. Ir a **Settings**.
2. Ir a **Environment Variables**.
3. Agregar:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Usar los valores copiados desde Supabase.

## Paso 4 - Deploy

En Vercel:

- Framework: Next.js.
- Build command: `npm run build`.
- Output: automatico.

## Como probar que Supabase quedo conectado

1. Abrir la pagina publicada.
2. Hacer el Rotómetro.
3. Activar `Aparecer en ranking publico`.
4. Terminar el test.
5. Abrir el ranking.
6. Si aparece el texto `Ranking global conectado a Supabase`, esta funcionando.

## Nota sobre seguridad

La V1 permite insertar resultados publicos anonimos. Esto es suficiente para publicar una primera version, pero no impide completamente spam o resultados falsos.

Para una V2 se recomienda:

- guardar sesiones en servidor;
- validar puntaje server-side;
- agregar rate limiting;
- agregar moderacion de nicknames;
- agregar panel de administracion.

