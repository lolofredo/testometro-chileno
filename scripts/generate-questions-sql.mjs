// Genera supabase/questions.sql con el texto de cada pregunta de cada test,
// leído directo de src/data/ (sin copiar a mano). Volver a correrlo y pegar
// el SQL en Supabase cada vez que cambien preguntas o versiones:
//   node --experimental-strip-types scripts/generate-questions-sql.mjs
// Con un test nuevo, generar además un archivo solo con ese test (más corto
// de pegar), en supabase/questions-<test>.sql:
//   node --experimental-strip-types scripts/generate-questions-sql.mjs <test>
import { writeFileSync } from "node:fs";

const onlySlug = process.argv[2];

const dataFiles = [
  ["../src/data/rotometro-original.ts", "rotometroOriginal"],
  ["../src/data/rotometro-2.ts", "rotometro2"],
  ["../src/data/cuicometro.ts", "cuicometro"],
  ["../src/data/chantometro.ts", "chantometro"],
  ["../src/data/farandulometro.ts", "farandulometro"]
];

const quote = (value) => `'${String(value).replace(/'/g, "''")}'`;

const header = [
  "-- Generado por scripts/generate-questions-sql.mjs. No editar a mano.",
  "-- Se pega en Supabase: SQL Editor -> New query -> Run, SIN seleccionar texto.",
  "-- Reemplaza las preguntas de cada test y versión; se puede correr de nuevo.",
  "",
  "create table if not exists questions (",
  "  test_slug text not null,",
  "  test_version text not null,",
  "  number smallint not null,",
  "  text text not null,",
  "  primary key (test_slug, test_version, number)",
  ");",
  "",
  "-- Solo se lee desde el panel de Supabase: sin acceso con la clave pública.",
  "alter table questions enable row level security;",
  "revoke all on table questions from anon, authenticated;",
  ""
];
const lines = [...header];

for (const [path, exportName] of dataFiles) {
  const test = (await import(new URL(path, import.meta.url)))[exportName];
  if (onlySlug && test.slug !== onlySlug) continue;
  lines.push(
    `delete from questions where test_slug = ${quote(test.slug)} and test_version = ${quote(test.version)};`,
    "insert into questions (test_slug, test_version, number, text) values"
  );
  // El número es la posición en el test (1, 2, 3…), igual que en test_answers.
  test.questions.forEach((question, index) => {
    const end = index === test.questions.length - 1 ? ";" : ",";
    lines.push(
      `  (${quote(test.slug)}, ${quote(test.version)}, ${index + 1}, ${quote(question.text)})${end}`
    );
  });
  lines.push("");
}

lines.push("notify pgrst, 'reload schema';");

const fileName = onlySlug ? `questions-${onlySlug}.sql` : "questions.sql";
if (lines.length === header.length) throw new Error(`No hay un test con slug ${onlySlug}`);
writeFileSync(new URL(`../supabase/${fileName}`, import.meta.url), `${lines.join("\n")}\n`);
console.log(`supabase/${fileName} generado`);
