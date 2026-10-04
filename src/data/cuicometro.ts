import type { TestDefinition, TestQuestion } from "@/lib/tests/types";

const questionTexts = [
  "Le has preguntado a alguien de qué colegio salió?",
  "Cuesta pronunciar tu apellido?",
  "Usas palabras en inglés innecesariamente?",
  "Te gusta dar consejos cuando nadie te los ha pedido?",
  "Consideras que tu viaje a Australia, a juntarte con chilenos, te cambió la vida?",
  "Conoces más de 10 países pero no conoces todo Chile?",
  "Piensas que el pobre es pobre porque es flojo?",
  "Crees que el golf es un deporte?",
  "Has entrado a una pega por pituto?",
  "Dices \"estoy pobre\" a la vuelta de unas vacaciones?",
  "Has ido a esquiar y lo cuentas como panorama normal de invierno?",
  "Consideras que Maitencillo se puso flaite?",
  "Tienes \"picás\" de platos de más de 20 lucas?",
  "Tienes o has tenido empleada doméstica?",
  "Te has puesto un chaleco cruzado sobre los hombros?",
  "Usas ropa Patagonia o North Face?",
  "Cuando regresas de un viaje, comparas todo lo que ves con el lugar al que fuiste?",
  "Dices que algo \"queda lejos\" si no está en tu radio habitual de tres comunas?",
  "Consideras flaites a los ñuñoínos?",
  "Conoces Ñuñoa?",
  "Conoces a alguien, o tú, te has metido con tu primo/a?",
  "Dices \"la señora que nos ayuda\" por no decir nana?",
  "Has dicho \"es como de la familia\" sobre alguien que trabaja en tu casa?",
  "Dices \"hoy me tocó limpiar\" como si fuera una hazaña?",
  "Usas el \"no hay dónde estacionar\" como razón para no ir a un lugar?",
  "Dices \"heavy\" para todo lo que es levemente intenso?",
  "Vas menos de una vez al año al centro de tu ciudad?",
  "Consideras que Rancagua, Talca y Curicó son el sur?",
  "Hablas \"del lago\" como si el lago viniera especificado por defecto?",
  "Te gusta el programa de política Sin Filtros?",
  "Has dicho \"no fue pituto, fue dato\"?",
  "Dices \"no somos cuicos\" porque conoces a gente más cuica que tú?",
  "Has usado el concepto \"se desperfiló\"?",
  "Consideras ordinaria a la gente que dice \"provecho\"?",
  "Te cae bien la Paty Maldonado o la Raquel Argandoña?",
  "Consideras que la familia de Joaquín Lavín es honesta?",
  "Vas a misa?",
  "Te espantas cuando alguien dice \"la calor\" o \"la mar\"?",
  "Confundes ocasionalmente algo popular tildándolo de flaite?",
  "Ante los escándalos de corrupción, eres de los que dicen \"dejemos que actúe la justicia\"?",
  "Consideras que El Mercurio se ha puesto zurdo?",
  "Te refieres a la Universidad Católica como \"la Cato\"?",
  "Ganas discusiones hablando más fuerte?",
  "Piensas que viajar por Sudamérica no es un viaje?",
  "Crees que RN no es de derecha?",
  "Si escuchas una canción de misa, te pones a cantarla?",
  "Te gusta subir cerros?",
  "Cuando te invitan a algún lugar, preguntas quiénes van?",
  "Llamas \"ingenería\" a la carrera de ingeniería comercial?",
  "Has ido al Interescolar?"
] as const;

const questions: TestQuestion[] = questionTexts.map((text, index) => ({
  displayOrder: index + 1,
  originalNumber: String(index + 1),
  text,
  pointsYes: 1,
  pointsNo: 0
}));

export const cuicometro: TestDefinition = {
  slug: "cuicometro",
  title: "Cuicómetro",
  eyebrow: "Humor de tribus chilenas",
  subtitle:
    "Un medidor social para detectar señales de cuiquerío cotidiano, familiar, universitario y de fin de semana largo.",
  description:
    "Cincuenta preguntas para medir cuánto se asoma el cuico interior entre colegios, apellidos, viajes, lago, misa, pitutos y frases que nadie pidió.",
  disclaimer:
    "Este test es una pieza de humor sobre cultura popular chilena. No representa una evaluación real de personas ni pretende diagnosticar nada más serio que ganas de reírse un rato.",
  version: "1.0",
  questions,
  resultRanges: [
    {
      groupNumber: 1,
      minScore: 0,
      maxScore: 5,
      title: "Infiltrado popular?",
      shortLabel: "0 a 5",
      description:
        "Está seguro de que era candidato al cuicómetro? Si así lo piensa, le advierto: sus amistades finas no lo quieren cerca. Definitivamente usted no está al nivel de ellos, y ellos lo saben. Por favor abra los ojos.",
      shareText: "Infiltrado popular. Mis amigos finos ya sospechan."
    },
    {
      groupNumber: 2,
      minScore: 6,
      maxScore: 12,
      title: "Cuico funcional de baja intensidad",
      shortLabel: "6 a 12",
      description:
        "Hay señales, pero todavía son administrables. A lo mejor usted piensa que puede pasar piola en cualquier ambiente, pero tenga cuidado. Cuando usted se hace el sencillo, la gente detecta su cuna.",
      shareText: "Cuico de baja intensidad. Paso piola, creo."
    },
    {
      groupNumber: 3,
      minScore: 13,
      maxScore: 20,
      title: "Cuico de fin de semana",
      shortLabel: "13 a 20",
      description:
        "Usted no vive completamente en el cuiquerío, pero lo visita con frecuencia. Déjeme advertirle: si piensa que no es cuico por no serlo 24/7, está equivocado. Es un cuico intermitente, pero reconocible.",
      shareText: "Cuico solo los fines de semana. De lunes a viernes, normal."
    },
    {
      groupNumber: 4,
      minScore: 21,
      maxScore: 28,
      title: "Cuico certificado por la Cato",
      shortLabel: "21 a 28",
      description:
        "Aquí el cuicómetro no miente: usted está certificado. Probablemente su presencia no sea bienvenida en sectores populares, aunque no los conozca. Con acción inmediata, podría popularizarse.",
      shareText: "Cuico certificado por la Cato. Tengo el diploma."
    },
    {
      groupNumber: 5,
      minScore: 29,
      maxScore: 36,
      title: "Cuico de lago",
      shortLabel: "29 a 36",
      description:
        "Esto comienza a ser serio. Hay gente que lo escucha hablar, y piensa por dentro \"y este hueón no se dará cuenta?\". Se recomienda conocer la vega o Lo Valledor, ojalá disfrazado. No prometemos resultados.",
      shareText: "Cuico de lago. La Vega la conozco por fotos."
    },
    {
      groupNumber: 6,
      minScore: 37,
      maxScore: 44,
      title: "Cuico patrimonial / aristócrata",
      shortLabel: "37 a 44",
      description:
        "Al parecer su cuiquerío es estructural, heredado y muy difícil de revertir. Aunque usted no se dé cuenta, la gente se aburre y se cansa al verlo. Es prácticamente imposible que usted sea una persona normal.",
      shareText: "Cuico patrimonial. Es heredado, no es culpa mía."
    },
    {
      groupNumber: 7,
      minScore: 45,
      maxScore: 50,
      title: "Cuico de Gran Reserva del Club de Golf",
      shortLabel: "45 a 50",
      description:
        "Esto no es divertido. Usted es un desagrado. A cada lugar que va, usted incomoda a la gente decente y normal. Se ruega POR FAVOR que considere irse fuera del país, total no le cuesta nada.",
      shareText: "Gran Reserva del Club de Golf. Me pidieron que me fuera del país."
    }
  ]
};
