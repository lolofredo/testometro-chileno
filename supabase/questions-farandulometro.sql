-- Generado por scripts/generate-questions-sql.mjs. No editar a mano.
-- Se pega en Supabase: SQL Editor -> New query -> Run, SIN seleccionar texto.
-- Reemplaza las preguntas de cada test y versión; se puede correr de nuevo.

create table if not exists questions (
  test_slug text not null,
  test_version text not null,
  number smallint not null,
  text text not null,
  primary key (test_slug, test_version, number)
);

-- Solo se lee desde el panel de Supabase: sin acceso con la clave pública.
alter table questions enable row level security;
revoke all on table questions from anon, authenticated;

delete from questions where test_slug = 'farandulometro' and test_version = '1.0';
insert into questions (test_slug, test_version, number, text) values
  ('farandulometro', '1.0', 1, '¿Viste la trilogía completa Gala-Mago-Coté López?'),
  ('farandulometro', '1.0', 2, '¿Has visto completa la gala del Festival de Viña, pero no el Festival?'),
  ('farandulometro', '1.0', 3, '¿Consumes reality shows?'),
  ('farandulometro', '1.0', 4, '¿Crees que los realities son tal cual se muestran?'),
  ('farandulometro', '1.0', 5, '¿Tomas en serio a Pamela Jiles, Andrés Longton, Hotuiti Teao, Maite Orsini o Florcita Motuda cuando hablan de política?'),
  ('farandulometro', '1.0', 6, '¿Has visto un programa de farándula "solo porque estaba puesto"?'),
  ('farandulometro', '1.0', 7, '¿Viste Mekano, Yingo, Calle 7 o similares?'),
  ('farandulometro', '1.0', 8, '¿Sigues algún portal de farándula en Instagram?'),
  ('farandulometro', '1.0', 9, '¿Has dicho "yo no veo farándula" sabiendo que no es así?'),
  ('farandulometro', '1.0', 10, '¿Has visto alguna vez un live donde alguien "iba a contar toda la verdad"?'),
  ('farandulometro', '1.0', 11, '¿Conoces a Danilo 21?'),
  ('farandulometro', '1.0', 12, '¿Crees que es válido ir a tribunales a demandar por injurias y calumnias?'),
  ('farandulometro', '1.0', 13, '¿Escuchaste más de tres veces el audio "tengo la pura care''cuica"?'),
  ('farandulometro', '1.0', 14, '¿Has defendido a algún "famoso" como si fuera tu primo?'),
  ('farandulometro', '1.0', 15, '¿Recuerdas un escándalo de farándula de los 2000 mejor que tu aniversario?'),
  ('farandulometro', '1.0', 16, '¿Puedes nombrar tres realities chilenos sin pensar?'),
  ('farandulometro', '1.0', 17, '¿Has revisado quién le dio like a quién para confirmar una teoría?'),
  ('farandulometro', '1.0', 18, '¿Has leído los comentarios de una publicación "solo para ver qué decía la gente"?'),
  ('farandulometro', '1.0', 19, '¿Has mandado un cahuín por DM con el mensaje "¿viste?"?'),
  ('farandulometro', '1.0', 20, '¿Has leído entero un comunicado de separación, incluida la parte de "pedimos respeto"?'),
  ('farandulometro', '1.0', 21, '¿Has visto un video de 40 minutos donde alguien "aclara la polémica"?'),
  ('farandulometro', '1.0', 22, '¿Tienes una opinión firme sobre un matrimonio famoso?'),
  ('farandulometro', '1.0', 23, '¿Has dicho "a mí siempre me cayó mal" cuando funaron a alguien?'),
  ('farandulometro', '1.0', 24, '¿Has usado la palabra "bombazo" en serio?'),
  ('farandulometro', '1.0', 25, '¿Crees que Cecilia Gutiérrez es una comunicadora?'),
  ('farandulometro', '1.0', 26, '¿Has dicho "se veía venir" sobre una pareja que no conoces?'),
  ('farandulometro', '1.0', 27, '¿Has reconocido a un "famoso" en la calle y has tenido que explicar quién era?'),
  ('farandulometro', '1.0', 28, '¿Sabes qué panelista se cambió de programa y por qué?'),
  ('farandulometro', '1.0', 29, '¿Has corregido a alguien que contó mal un cahuín?'),
  ('farandulometro', '1.0', 30, '¿Te sabes el horario de más de un programa de farándula?');

notify pgrst, 'reload schema';
