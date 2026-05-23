# Testómetro Chileno - Documento tecnico V1

## 1. Resumen

**Testómetro Chileno** sera una plataforma web responsive de tests de cultura popular chilena. El primer test publicado sera el **Rotómetro Original**, tratado como una pieza de archivo de internet chileno antiguo.

La V1 debe permitir que una persona entre desde celular o escritorio, ingrese un nickname, responda el Rotómetro en bloques de preguntas, pueda pausar/continuar, vea su progreso, reciba un resultado calculado por puntaje y pueda aparecer en un ranking publico.

## 2. Decisiones cerradas

- Producto: web app responsive, no app movil nativa en V1.
- Nombre paraguas: **Testómetro Chileno**.
- Primer test: **Rotómetro Original**.
- Stack recomendado: **Next.js + Tailwind CSS + Supabase/PostgreSQL + Vercel**.
- Login: no obligatorio en V1.
- Usuario: sesion anonima con nickname.
- Ranking: si, publico, con opcion explicita para aparecer o no aparecer.
- Texto del Rotómetro: 100% fiel al material entregado, incluyendo ortografia, estilo, expresiones y tono original.
- Contexto editorial: incluir disclaimer breve para enmarcarlo como humor antiguo/clasista de internet, sin suavizar el cuestionario.
- Experiencia principal: bloques de aproximadamente 10 preguntas por pantalla.
- Guardado de avance: localStorage + persistencia de sesion en Supabase.
- Pregunta con puntaje especial: la pregunta 70 vale 2 puntos porque el texto indica `(+ 2 ptos)`.
- Fuente canonica V1: las 150 preguntas entregadas en el prompt del 23 de mayo de 2026.

## 3. Alcance V1

### Incluye

- Landing simple de Testómetro Chileno.
- Catalogo inicial con el Rotómetro Original.
- Pagina de contexto del Rotómetro Original.
- Inicio de test con nickname y preferencia de ranking.
- Cuestionario en bloques de 10 preguntas.
- Respuestas booleanas: Si / No.
- Preguntas opcionales: el usuario puede avanzar y finalizar con preguntas sin responder.
- Respuestas deseleccionables: tocar una opcion ya marcada vuelve a dejar la pregunta sin responder.
- Progreso visible por bloque, pregunta y porcentaje.
- Guardado automatico.
- Continuar test si el usuario vuelve despues.
- Resultado final con grupo, puntaje y texto compartible.
- Ranking publico del Rotómetro.
- Estructura tecnica preparada para agregar nuevos tests.

### No incluye en V1

- Login con Google u otros proveedores.
- Panel admin.
- Edicion de preguntas desde interfaz.
- Imagen compartible generada server-side.
- Multiples tipos de pregunta.
- Resultados por patrones o subtipos.
- Moderacion avanzada de nicknames.

## 4. Experiencia de usuario

### Flujo principal

1. Usuario entra a `/`.
2. Ve Testómetro Chileno y el test destacado: Rotómetro Original.
3. Entra a `/tests/rotometro-original`.
4. Lee una bajada breve de contexto y presiona empezar.
5. Ingresa nickname.
6. Elige si quiere aparecer en ranking publico.
7. Responde bloques de 10 preguntas.
8. Puede avanzar, retroceder, pausar o continuar despues.
9. Al finalizar ve resultado.
10. Puede compartir link, copiar texto, ver ranking o volver al catalogo.

### Patron de cuestionario

La experiencia no sera una sola lista de 150 checkboxes ni una pregunta aislada por pantalla. Para equilibrar velocidad y comodidad:

- Cada pantalla mostrara alrededor de 10 preguntas.
- Cada pregunta tendra botones grandes `Si` y `No`.
- El avance se guardara al responder cada pregunta.
- Las preguntas no seran obligatorias.
- Si el usuario vuelve a presionar la opcion marcada, la respuesta se desmarca.
- El usuario podra cambiar respuestas antes de finalizar.
- Habra un boton `Guardar y seguir despues`.
- En mobile, el bloque se comportara como una lista vertical clara y rapida.
- En desktop, se mantendra una columna principal legible, no una grilla densa.

### Progreso

Elementos visibles durante el test:

- Barra de progreso global.
- Texto: `Bloque 4 de 15`.
- Texto: `37 de 150 preguntas respondidas`.
- Puntaje parcial oculto por defecto para no sesgar respuestas.

## 5. Tono y contenido

El Rotómetro Original contiene clasismo, estereotipos, lenguaje despectivo y humor de otra epoca. La V1 lo preservara como archivo, pero la interfaz debe contextualizarlo.

Disclaimer recomendado:

> Este test reproduce un cuestionario humoristico de internet chileno antiguo. Contiene lenguaje, estereotipos y criterios clasistas propios de su epoca. No representa una evaluacion real de personas ni la mirada editorial de Testómetro Chileno.

Regla editorial:

- No corregir ortografia del cuestionario.
- No modernizar expresiones.
- No reemplazar palabras incomodas.
- No agregar explicaciones dentro de cada pregunta.
- Si se crean versiones futuras, deben ser tests separados: `rotometro-2`, `rotometro-actualizado`, etc.

## 6. Diseño visual

### Direccion general

La plataforma debe sentirse moderna, rapida y mobile-first, con una capa grafica de cultura popular chilena. El Rotómetro puede tener una identidad mas retro/pop, pero sin hacer que la interfaz sea dificil de usar.

### Principios

- Interfaz clara, escaneable y rapida.
- Botones grandes para uso con pulgar.
- Colores fuertes, pero no una paleta monotona.
- Guiños a diario popular chileno, internet 2000 y archivo digital.
- Tipografia legible, no depender de Comic Sans ni de una estetica "fea" como base.
- Resultado final con tratamiento visual tipo titular.

### Resultado visual

La tarjeta final debe tener estructura tipo aviso/titular:

```text
ULTIMO MINUTO
[NICKNAME] CAYO EN EL ROTOMETRO

Resultado:
ROTO TIPICO

Puntaje:
38 puntos

Grupo 3
Segun el instrumento patrimonial de internet chileno 2000...
```

## 7. Arquitectura tecnica

### Stack

- Framework: Next.js con App Router.
- Lenguaje: TypeScript.
- Estilos: Tailwind CSS.
- Base de datos: Supabase/PostgreSQL.
- Hosting: Vercel.
- Estado local: React state + localStorage.
- Persistencia remota: Supabase.

### Rutas

```text
/
/tests
/tests/[slug]
/tests/[slug]/start
/tests/[slug]/play
/results/[sessionId]
/rankings/[slug]
/about
```

### Estructura propuesta

```text
src/
  app/
    page.tsx
    tests/
      page.tsx
      [slug]/
        page.tsx
        start/
          page.tsx
        play/
          page.tsx
    results/
      [sessionId]/
        page.tsx
    rankings/
      [slug]/
        page.tsx
    about/
      page.tsx
  components/
    layout/
      Header.tsx
      Footer.tsx
    test/
      QuestionBlock.tsx
      QuestionRow.tsx
      ProgressBar.tsx
      ResultCard.tsx
      RankingTable.tsx
  data/
    seed/
      rotometro-original.json
  lib/
    supabase/
      client.ts
      server.ts
    tests/
      scoring.ts
      types.ts
      storage.ts
```

## 8. Modelo de datos

El modelo debe ser generico para soportar futuros tests.

### `tests`

```sql
create table tests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  instructions text,
  disclaimer text,
  version text not null default '1.0',
  status text not null default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### `questions`

```sql
create table questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  display_order integer not null,
  original_number text,
  question_text text not null,
  question_type text not null default 'boolean',
  points_yes integer not null default 1,
  points_no integer not null default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique(test_id, display_order)
);
```

### `result_ranges`

```sql
create table result_ranges (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  group_number integer not null,
  min_score integer not null,
  max_score integer,
  title text not null,
  short_label text,
  description text,
  share_text text,
  created_at timestamptz default now()
);
```

### `test_sessions`

```sql
create table test_sessions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  user_id uuid null,
  nickname text,
  is_public boolean default false,
  status text not null default 'in_progress',
  current_block integer default 1,
  current_question_order integer default 1,
  score integer default 0,
  result_range_id uuid references result_ranges(id),
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### `answers`

```sql
create table answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references test_sessions(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  answer_value text not null,
  points_awarded integer not null default 0,
  answered_at timestamptz default now(),
  unique(session_id, question_id)
);
```

## 9. Reglas de scoring

### Rotómetro Original V1

- Tipo de respuesta: booleano.
- `Si` suma `points_yes`.
- `No` suma `0`.
- Todas las preguntas valen 1 punto excepto la pregunta 70.
- Pregunta 70: `Le agrada esta combinacion?: medias de terno,zapatos de vestir y short? (+ 2 ptos)` vale 2 puntos.
- Puntaje maximo V1: 151 puntos, porque hay 150 preguntas y una vale 2.

### Rangos de resultado

Se mantienen los grupos originales definidos en la conversacion:

| Grupo | Rango | Titulo |
| --- | ---: | --- |
| 0 | 0 | Fuera de escala |
| 1 | 1-14 | Cuico / High Life |
| 2 | 15-28 | Todavia pasas |
| 3 | 29-42 | Roto tipico |
| 4 | 43-56 | Roto sabroson |
| 5 | 57-70 | Roto-roto-reroto |
| 6 | 71-84 | Recontra roto |
| 7 | 85+ | Cuma total |

Nota: el grupo 0 no pertenece al material original; es una categoria tecnica agregada por la app para cubrir el caso de 0 puntos.

## 10. Ranking publico

### Datos visibles

- Posicion.
- Nickname.
- Puntaje.
- Grupo.
- Fecha de completitud.

### Reglas

- Solo aparecen sesiones `completed`.
- Solo aparecen sesiones con `is_public = true`.
- No se muestran respuestas individuales.
- No se exige login.
- El nickname debe tener limite de largo.
- Se debe filtrar HTML o caracteres peligrosos antes de renderizar.

### Orden

1. Mayor puntaje primero.
2. Si hay empate, quien completo antes aparece primero.

## 11. Guardado y continuidad

### Local

Se guardara en `localStorage`:

```json
{
  "sessionId": "uuid",
  "testSlug": "rotometro-original",
  "nickname": "Juanito",
  "isPublic": true,
  "answers": {
    "1": "yes",
    "2": "no"
  },
  "currentBlock": 3,
  "updatedAt": "2026-05-23T00:00:00.000Z"
}
```

### Remoto

Cada respuesta se enviara a Supabase con upsert. Si hay problemas de conexion, la app puede seguir localmente y sincronizar al reintentar.

## 12. Seed del Rotómetro Original

Archivo esperado:

```text
src/data/seed/rotometro-original.json
```

Estructura:

```json
{
  "slug": "rotometro-original",
  "title": "Rotómetro Original",
  "version": "1.0",
  "questionCount": 150,
  "questions": [
    {
      "displayOrder": 1,
      "originalNumber": "1",
      "text": "Usa para paseos la ropa deportiva que le dieron para el campeonato interempresarial?",
      "pointsYes": 1,
      "pointsNo": 0
    },
    {
      "displayOrder": 70,
      "originalNumber": "70",
      "text": "Le agrada esta combinacion?: medias de terno,zapatos de vestir y short? (+ 2 ptos)",
      "pointsYes": 2,
      "pointsNo": 0
    }
  ]
}
```

## 13. Consideraciones legales y de privacidad

- No pedir nombre real.
- No pedir email en V1.
- No guardar datos personales sensibles.
- Nickname y resultado son pseudonimos, no identidad verificada.
- Ranking publico debe ser opt-in.
- Incluir opcion para no aparecer en ranking.
- En una V1 publica real conviene incluir pagina simple de privacidad.

## 14. Plan de implementacion

### Fase 1 - Base del proyecto

- Crear app Next.js con TypeScript.
- Configurar Tailwind.
- Crear estructura de rutas.
- Crear componentes base de layout.
- Crear seed local del Rotómetro.

### Fase 2 - Cuestionario

- Crear flujo start/play.
- Implementar bloques de 10 preguntas.
- Implementar respuestas Si/No.
- Implementar progreso.
- Implementar guardado en localStorage.
- Implementar calculo local de resultado.

### Fase 3 - Supabase

- Crear schema SQL.
- Configurar variables de entorno.
- Crear cliente Supabase.
- Crear sesiones.
- Guardar respuestas.
- Completar sesion.
- Calcular resultado persistido.

### Fase 4 - Resultado y ranking

- Crear pagina `/results/[sessionId]`.
- Crear ResultCard.
- Crear ranking publico.
- Crear botones de compartir/copiar.

### Fase 5 - Pulido

- Ajustar responsive.
- Probar mobile y desktop.
- Revisar copy.
- Verificar que las 150 preguntas se rendericen fielmente.
- Preparar deploy en Vercel.

## 15. Riesgos

- La lista actual contiene 150 preguntas, aunque en la conversacion previa se mencionaba una cifra cercana a 160. Para V1 se usaran las 150 preguntas entregadas como fuente canonica.
- El contenido puede incomodar o ser malinterpretado sin contexto. Se mitiga con disclaimer visible.
- Sin login, una persona puede repetir resultados y rankings. En V1 se acepta; en V2 se puede limitar por dispositivo, IP hash o cuenta.
- Supabase agrega complejidad inicial, pero deja lista la plataforma para ranking y futuros tests.

## 16. Checkpoints antes de programar

- Validar que la lista de 150 preguntas sera la fuente canonica de V1, ya que en la conversacion previa se mencionaba una cifra cercana a 160.
- Definir si el ranking publico aparece por defecto opt-in marcado o desmarcado. Recomendacion: desmarcado por privacidad.
- Entregar o crear proyecto Supabase.
- Definir si se usara Vercel desde el primer deploy o primero desarrollo local.
