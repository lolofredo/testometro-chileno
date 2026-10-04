import type { TestDefinition, TestQuestion } from "@/lib/tests/types";

const questionTexts = [
  "¿Pusiste \"inglés avanzado\" en el currículum y tu mayor logro es entender los memes?",
  "¿Tu \"Excel avanzado\" consiste en pintar celdas de colores?",
  "¿Dijiste en una entrevista que tu mayor defecto es \"ser demasiado perfeccionista\"?",
  "¿Consideras a Kaminski un emprendedor?",
  "¿Te gustaría trabajar en una municipalidad?",
  "Para zafar, ¿algún familiar tuyo \"ha muerto\" más de una vez?",
  "¿Has dejado el mouse moviéndose solo para aparecer \"conectado\" en teletrabajo?",
  "¿Eres parte del selecto grupo que viajó al extranjero estando con licencia médica?",
  "¿Has dicho \"lo estamos viendo\" sobre algo que nadie está viendo?",
  "¿Crees que el Huevo Fuenzalida \"la hizo bien\" registrando marcas ajenas?",
  "¿Te han tenido que \"recordar\" una transferencia que habías quedado de hacer?",
  "Si tuvieras un problema legal, ¿te gustaría que te defendiera Lucho Hermosilla?",
  "¿Consideras que Emeterio Ureta debería tener más espacio en la TV?",
  "¿Has ido estratégicamente al baño cuando llegó la cuenta?",
  "¿Crees que Mauricio Israel es honesto?",
  "¿Pediste plata prestada para pagarle a otro al que le debías, y lo llamaste \"gestión financiera\"?",
  "¿Consideras que la justicia es justa con los delitos financieros?",
  "¿Crees que Tonka Tomicic debía volver a la TV?",
  "¿Publicaste \"se vende por viaje\" sin tener pasaje ni intención?",
  "¿Has boleteado por una \"asesoría verbal\" de la que no queda ni un audio?",
  "¿Le creíste, aunque sea un 1%, a Cote López?",
  "¿Has dicho \"se me murió el celular\" con batería suficiente?",
  "¿Has cortado una llamada diciendo \"aló, aló, aló…\" y fingiendo no escuchar?",
  "¿Has jurado en vano por algún familiar?",
  "¿Ofreciste ayudar en una mudanza y ese día \"te surgió una emergencia\"?",
  "¿Has dicho \"cuenta conmigo para lo que necesites\" rogando que no necesite nada?",
  "¿Pagas un gimnasio al que no vas, pero dices \"estoy entrenando\"?",
  "¿Llegas a las juntas con las manos vacías y una sonrisa?",
  "¿Has \"maquillado\" la verdad en aplicaciones de citas?",
  "¿Has dicho \"te llamo\" con la tranquilidad de quien sabe que jamás lo hará?",
  "¿Te presentas como \"emprendedor\" cuando estás desempleado?",
  "¿Has pensado en vender cursos online?",
  "¿Enseñas a invertir después de haber perdido tus ahorros invirtiendo?",
  "¿Has escrito \"voy saliendo\" cuando te faltaban más de 10 minutos para salir?",
  "¿Has dicho \"tengo un proyecto que te puede interesar\" y era un negocio piramidal?",
  "¿Eres de los que hablan constantemente de negocios y de plata?",
  "¿Te has \"retocado\" antes de subir o mandar alguna foto?",
  "¿Has emitido boletas ideológicamente falsas?",
  "¿Le pediste algo a una inteligencia artificial y después dijiste \"me costó harto hacerlo\"?",
  "¿Has dicho \"estamos conversando con inversionistas\" y el inversionista era tu tío?",
  "¿Usas el concepto \"optimización de impuestos\"?",
  "¿Has dicho \"¿usted sabe quién soy yo?\" sin ser absolutamente nadie?",
  "¿Te estacionaste en el espacio para personas con discapacidad y te bajaste cojeando, por si acaso?",
  "¿Has inventado una historia para que no te saquen un parte?",
  "¿Has preguntado \"¿y sin boleta en cuánto queda?\"?",
  "¿Reclamas \"con mis impuestos\" sabiendo que debes más que Don Ramón?",
  "¿Crees que Sammis Reyes es un genio de los negocios?",
  "¿Estás de acuerdo con que exista Capitán Yáber?",
  "¿Has devuelto un artículo por \"falla\" sabiendo que tú lo hiciste fallar?",
  "¿Adulteraste tests de COVID?"
] as const;

const questions: TestQuestion[] = questionTexts.map((text, index) => ({
  displayOrder: index + 1,
  originalNumber: String(index + 1),
  text,
  pointsYes: 1,
  pointsNo: 0
}));

export const chantometro: TestDefinition = {
  slug: "chantometro",
  title: "Chantómetro",
  eyebrow: "Humor de tribus chilenas",
  subtitle: "¿Qué tan chanta eres?",
  description:
    "Cincuenta preguntas para medir tu nivel de chantería: excusas, humo, promesas que nadie pidió y plata que nunca llegó.",
  disclaimer:
    "Este test es una pieza de humor sobre cultura popular chilena. No representa una evaluación real de personas ni pretende diagnosticar nada más serio que ganas de reírse un rato. Las menciones a personas reales son sátira y preguntan por tu opinión; no afirman hechos.",
  version: "1.0",
  questions,
  resultRanges: [
    {
      groupNumber: 1,
      minScore: 0,
      maxScore: 5,
      title: "Honesto de museo",
      shortLabel: "0 a 5",
      description:
        "Especie protegida. Devuelves el vuelto de más y avisas cuando vas atrasado. Nadie te cree.",
      shareText: "Soy honesto de museo. Sí, todavía existimos."
    },
    {
      groupNumber: 2,
      minScore: 6,
      maxScore: 12,
      title: "Chanta en práctica",
      shortLabel: "6 a 12",
      description: "Mientes poco y mal. Se te nota en la cara y después te da culpa.",
      shareText: "Chanta en práctica: aún me da culpa."
    },
    {
      groupNumber: 3,
      minScore: 13,
      maxScore: 20,
      title: "Vendedor de humo part-time",
      shortLabel: "13 a 20",
      description: "Tu \"voy saliendo\" ya no engaña a nadie, pero igual lo mandas.",
      shareText: "Vendo humo, pero solo media jornada."
    },
    {
      groupNumber: 4,
      minScore: 21,
      maxScore: 28,
      title: "Chanta titulado",
      shortLabel: "21 a 28",
      description:
        "Dominas la excusa, el \"te llamo\" y el \"lo estamos viendo\". Tienes futuro.",
      shareText: "Chanta titulado, con mención en excusas."
    },
    {
      groupNumber: 5,
      minScore: 29,
      maxScore: 36,
      title: "Chanta con magíster (online)",
      shortLabel: "29 a 36",
      description: "Tu currículum es ficción y tu LinkedIn, ciencia ficción.",
      shareText: "Tengo un magíster en chantería. Online, obvio."
    },
    {
      groupNumber: 6,
      minScore: 37,
      maxScore: 44,
      title: "Gerente general del humo",
      shortLabel: "37 a 44",
      description: "La gente te presta plata sabiendo cómo termina. Eso es talento.",
      shareText: "Gerente general del humo. Te transfiero altiro."
    },
    {
      groupNumber: 7,
      minScore: 45,
      maxScore: 50,
      title: "Patrimonio chanta de la humanidad",
      shortLabel: "45 a 50",
      description: "Deberían estudiarte. Y cobrarte lo que debes.",
      shareText: "Soy patrimonio chanta de la humanidad."
    }
  ]
};
