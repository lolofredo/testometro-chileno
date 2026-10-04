import type { TestDefinition, TestQuestion } from "@/lib/tests/types";

const questionTexts = [
  "Escuchas música con tu celular sin audífonos en lugares públicos?",
  "Evades el pago en el transporte público, pero para criticarlo eres el primero?",
  "Sigues al repartidor en el mapa como si fuera final de campeonato?",
  "Usas \"mejores amigos\" para contar lo que te pasa?",
  "Publicas frases filosóficas de reflexión de baño público?",
  "Consumes OnlyFans o Arsmate?",
  "Publicas más de una historia al día?",
  "Has ido en pijama a buscar un delivery?",
  "Tienes una colección de bolsas plásticas en tu casa que solo aumenta?",
  "Usas papel higiénico como servilleta?",
  "Usas toalla nova como papel higiénico?",
  "Has usado calcetines viejos, diario u otro recurso de emergencia en el baño?",
  "Pones reclamos en el delivery buscando ganar una compensación, cuando sabes que el pedido llegó bien?",
  "Te gusta la farándula?",
  "Has dejado basura en la micro, plaza, playa o estadio?",
  "Has comido sopaipillas, completo o empanada en transporte público dejando olor a todo el carro?",
  "Cuando ves una emergencia en la calle, eres de los que graban en lugar de ayudar?",
  "Has tomado bebida directo de la botella familiar y después te haces el hueón?",
  "Sigues cuentas de copuchas?",
  "Compartes funas sin leerlas?",
  "Peleas con otras personas por redes sociales?",
  "Regalas alcohol para los cumpleaños?",
  "Si sales con más gente a comer o tomar, esperas a pagar al final para ver si zafaste?",
  "Eres de los que dice \"te transfiero\" y jamás lo haces?",
  "Dices \"son cinco minutitos\" dejando el auto bloqueando y cagándose en el resto?",
  "Eres de los que toca la bocina al segundo exacto en que cambia la luz?",
  "Tiras basura o no recoges la caca de tu perro cuando nadie te ve?",
  "Te gusta ir con música fuerte en el auto para que todos escuchen?",
  "Encuentras que los autos enchulados con luces se ven bien?",
  "Dejas el carro del supermercado en cualquier parte del estacionamiento?",
  "Usas el estacionamiento de visitas de tu edificio como si fuera tuyo?",
  "Eres de los que usa el carro del edificio y no lo devuelve?",
  "Has dejado pelos pegados en el jabón?",
  "Crees que el perfume, desodorante o champú seco reemplaza la ducha?",
  "Cuando sientes olor a axila, te hueles disimuladamente para ver si eres tú?",
  "Picoteas papas fritas de otro plato o mesa \"pa que no se pierdan\"?",
  "Eres de los que pregunta \"a ver cuál es tu nombre\" cuando pones un reclamo?",
  "Si llevas algo a un asado y no se abrió, te lo llevas de vuelta sin que te vean?",
  "Has rellenado una botella de destilado bueno con uno penca?",
  "Cuando te invitan a almorzar, te comes hasta el último grano de arroz, porque \"es gratis\"?",
  "Compras poleras de fútbol o remedios en las ferias?",
  "Te gusta ver los videos del tío René?",
  "Te gusta ver las fiscalizaciones del matinal?",
  "Si vas a un tenedor libre, comes hasta \"salir ganando\"?",
  "Te subes al metro antes de que la gente termine de bajar?",
  "Le pones Coca-Cola al vino tinto?",
  "Consideras que la TV chilena es seria?",
  "Te gusta el fanshop?",
  "Te tiras peos en lugares públicos?",
  "Te inspira Sammis Reyes?"
] as const;

const questions: TestQuestion[] = questionTexts.map((text, index) => ({
  displayOrder: index + 1,
  originalNumber: String(index + 1),
  text,
  pointsYes: 1,
  pointsNo: 0
}));

export const rotometro2: TestDefinition = {
  slug: "rotometro-2",
  title: "Rotómetro 2.0",
  eyebrow: "Chile digital actual",
  subtitle: "Una actualización del medidor para el Chile de delivery, copuchas y convivencia al límite.",
  description:
    "Cincuenta preguntas para medir señales contemporáneas de rotería cotidiana, entre internet, transporte público, carrete, edificio, auto y grupo de WhatsApp.",
  disclaimer:
    "Este test es una pieza de humor sobre cultura popular chilena. No representa una evaluación real de personas ni pretende diagnosticar nada más serio que ganas de reírse un rato.",
  version: "2.0",
  questions,
  resultRanges: [
    {
      groupNumber: 1,
      minScore: 0,
      maxScore: 5,
      title: "Fino y elegante",
      shortLabel: "0 a 5",
      description:
        "Usted pasó por el Rotómetro 2.0 sin mancharse. El sistema no sabe si está frente a una persona civilizada o alguien que mintió con un descaro preocupante. Si fue honesto, siga así.",
      shareText: "Fino y elegante. O mentí con un descaro preocupante."
    },
    {
      groupNumber: 2,
      minScore: 6,
      maxScore: 12,
      title: "Chileno decente con señales menores",
      shortLabel: "6 a 12",
      description:
        "Usted todavía opera dentro de los márgenes de la convivencia humana, pero el sistema detectó pequeñas grietas. No es grave, pero tampoco se haga el fino. Hay síntomas, pero nada que no se pueda ajustar.",
      shareText: "Chileno decente. Las señales son menores, lo juro."
    },
    {
      groupNumber: 3,
      minScore: 13,
      maxScore: 20,
      title: "Roto de baja intensidad",
      shortLabel: "13 a 20",
      description:
        "Aquí ya no hablamos de coincidencias. Usted tiene conductas que el Chile 2026 reconoce de inmediato. No es el peor del curso, pero bastante lejos de los mejores. No le haría mal refinarse un poco.",
      shareText: "Roto, pero de baja intensidad. Casi ni se nota."
    },
    {
      groupNumber: 4,
      minScore: 21,
      maxScore: 28,
      title: "Roto oficial",
      shortLabel: "21 a 28",
      description:
        "Esto ya es oficial: usted es un roto de tomo y lomo. Se recomienda tomar cartas en el asunto, y acercarse más a los cuicos. Está en el punto en que o se endereza, o se va por un tubo sin retorno de ordinariez.",
      shareText: "Ya es oficial: roto de tomo y lomo."
    },
    {
      groupNumber: 5,
      minScore: 29,
      maxScore: 36,
      title: "Roto y cuma profesional",
      shortLabel: "29 a 36",
      description:
        "Esto comienza a preocupar. Su rotería y ordinariez no tienen límite. Se recomienda que comience estudiar a los cuicos de manera inmediata. No podemos afirmar que salga de su cumerío.",
      shareText: "Roto y cuma profesional. Con años de experiencia."
    },
    {
      groupNumber: 6,
      minScore: 37,
      maxScore: 44,
      title: "Monumento nacional al mal vivir",
      shortLabel: "37 a 44",
      description:
        "El sistema entró en alerta máxima. La convivencia a usted realmente le vale hongo. Lo pongan donde lo pongan, es un caso perdido. Debemos ser honestos: es muy probable que nunca salga de su estado.",
      shareText: "Soy monumento nacional al mal vivir. Pasen a verme."
    },
    {
      groupNumber: 7,
      minScore: 45,
      maxScore: 50,
      title: "A su lado, el roto promedio es cuico",
      shortLabel: "45 a 50",
      description:
        "Esto ya no es gracioso. Usted es una carga para la sociedad. No aporta, no colabora, y su presencia nos hace a todos peores personas. POR FAVOR considere irse a vivir a la montaña y deje de estorbar.",
      shareText: "A mi lado, el roto promedio es cuico."
    }
  ]
};
