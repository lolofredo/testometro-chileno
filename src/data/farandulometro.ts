import type { TestDefinition, TestQuestion } from "@/lib/tests/types";

// 30 preguntas (los demás tests nuevos tienen 50): experimento de largo para
// comparar cuántos lo terminan y lo comparten (reporte 9 de events-report.sql).
const questionTexts = [
  "¿Viste la trilogía completa Gala-Mago-Coté López?",
  "¿Has visto completa la gala del Festival de Viña, pero no el Festival?",
  "¿Consumes reality shows?",
  "¿Crees que los realities son tal cual se muestran?",
  "¿Tomas en serio a Pamela Jiles, Andrés Longton, Hotuiti Teao, Maite Orsini o Florcita Motuda cuando hablan de política?",
  "¿Has visto un programa de farándula \"solo porque estaba puesto\"?",
  "¿Viste Mekano, Yingo, Calle 7 o similares?",
  "¿Sigues algún portal de farándula en Instagram?",
  "¿Has dicho \"yo no veo farándula\" sabiendo que no es así?",
  "¿Has visto alguna vez un live donde alguien \"iba a contar toda la verdad\"?",
  "¿Conoces a Danilo 21?",
  "¿Crees que es válido ir a tribunales a demandar por injurias y calumnias?",
  "¿Escuchaste más de tres veces el audio \"tengo la pura care'cuica\"?",
  "¿Has defendido a algún \"famoso\" como si fuera tu primo?",
  "¿Recuerdas un escándalo de farándula de los 2000 mejor que tu aniversario?",
  "¿Puedes nombrar tres realities chilenos sin pensar?",
  "¿Has revisado quién le dio like a quién para confirmar una teoría?",
  "¿Has leído los comentarios de una publicación \"solo para ver qué decía la gente\"?",
  "¿Has mandado un cahuín por DM con el mensaje \"¿viste?\"?",
  "¿Has leído entero un comunicado de separación, incluida la parte de \"pedimos respeto\"?",
  "¿Has visto un video de 40 minutos donde alguien \"aclara la polémica\"?",
  "¿Tienes una opinión firme sobre un matrimonio famoso?",
  "¿Has dicho \"a mí siempre me cayó mal\" cuando funaron a alguien?",
  "¿Has usado la palabra \"bombazo\" en serio?",
  "¿Crees que Cecilia Gutiérrez es una comunicadora?",
  "¿Has dicho \"se veía venir\" sobre una pareja que no conoces?",
  "¿Has reconocido a un \"famoso\" en la calle y has tenido que explicar quién era?",
  "¿Sabes qué panelista se cambió de programa y por qué?",
  "¿Has corregido a alguien que contó mal un cahuín?",
  "¿Te sabes el horario de más de un programa de farándula?"
];

const questions: TestQuestion[] = questionTexts.map((text, index) => ({
  displayOrder: index + 1,
  originalNumber: String(index + 1),
  text,
  pointsYes: 1,
  pointsNo: 0
}));

export const farandulometro: TestDefinition = {
  slug: "farandulometro",
  title: "Farandulómetro",
  eyebrow: "Farándula chilena",
  subtitle: "¿Qué tan farandulero eres?",
  description:
    "30 preguntas de sí o no para medir cuánto cahuín consumes, aunque jures que no ves farándula.",
  disclaimer:
    "Este test es una pieza de humor sobre cultura popular chilena. No representa una evaluación real de personas ni pretende diagnosticar nada más serio que ganas de reírse un rato. Las menciones a personas reales son sátira y preguntan por tu opinión; no afirman hechos.",
  version: "1.0",
  questions,
  resultRanges: [
    {
      groupNumber: 1,
      minScore: 0,
      maxScore: 3,
      title: "Vive bajo una piedra",
      shortLabel: "0 a 3",
      description:
        "No sabes quién se separó de quién y duermes perfecto. O mentiste en la mitad, que también es bien de farándula.",
      shareText: "No sé quién es nadie y vivo tranquilo."
    },
    {
      groupNumber: 2,
      minScore: 4,
      maxScore: 8,
      title: "Se entera por la tía",
      shortLabel: "4 a 8",
      description:
        "No buscas el cahuín, pero el cahuín te encuentra: en el almuerzo familiar, en el grupo de WhatsApp o en la peluquería.",
      shareText: "Yo no veo farándula, me la cuentan."
    },
    {
      groupNumber: 3,
      minScore: 9,
      maxScore: 13,
      title: "Copuchento ocasional",
      shortLabel: "9 a 13",
      description:
        "Juras que no te interesa, pero si sale el tema te quedas hasta el final. Y pides detalles.",
      shareText: "No me interesa, pero cuéntame todo."
    },
    {
      groupNumber: 4,
      minScore: 14,
      maxScore: 18,
      title: "Panelista de sobremesa",
      shortLabel: "14 a 18",
      description:
        "Tienes opinión formada sobre parejas que no conoces y la defiendes con argumentos. En tu mesa, el debate lo moderas tú.",
      shareText: "Tengo una opinión firme y nadie me la pidió."
    },
    {
      groupNumber: 5,
      minScore: 19,
      maxScore: 23,
      title: "Opinólogo sin contrato",
      shortLabel: "19 a 23",
      description:
        "Sigues los portales, lees los comunicados enteros y revisas los likes. Haces el trabajo de un panelista, pero gratis.",
      shareText: "Hago esto gratis, imagínate con sueldo."
    },
    {
      groupNumber: 6,
      minScore: 24,
      maxScore: 27,
      title: "Fuente cercana",
      shortLabel: "24 a 27",
      description:
        "Cuando la prensa dice \"una fuente cercana a la pareja\", todos te miran a ti. Sabes las cosas antes de que salgan en pantalla.",
      shareText: "Yo ya sabía, pero no podía decir nada."
    },
    {
      groupNumber: 7,
      minScore: 28,
      maxScore: 30,
      title: "Editor general del cahuín",
      shortLabel: "28 a 30",
      description:
        "No sigues la farándula: la farándula te sigue a ti. Cuando pasa algo, la gente te escribe antes de buscar en Google.",
      shareText: "No es copucha, es periodismo de investigación."
    }
  ]
};
