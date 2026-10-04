export type MemeItem = {
  slug: string;
  title: string;
  imageSrc: string;
  alt: string;
  description: string;
  tags: string[];
  publishedAt: string;
};

export const memeSections = [
  {
    title: "Rotos y Chile popular",
    description:
      "Memes sobre escenas, frases y costumbres reconocibles de la cultura popular chilena."
  },
  {
    title: "Cuicos y rituales sociales",
    description:
      "Material para el futuro Cuicómetro: gestos, códigos, lugares comunes y humor de tribu."
  },
  {
    title: "Archivo Testómetro",
    description:
      "Piezas visuales para acompañar tests, rankings, resultados y momentos compartibles."
  }
];

export const memes: MemeItem[] = [
  {
    slug: "calle-con-apellido",
    title: "Calle con apellido",
    imageSrc: "/memes/meme-2.png",
    alt: "Meme chileno sobre alguien que dice que no le falta calle porque hay calles con su apellido.",
    description:
      "Ese momento exacto en que el roce social se confunde con vivir cerca de una avenida familiar.",
    tags: ["cuicos", "calle", "humor chileno"],
    publishedAt: "2026-05-24"
  },
  {
    slug: "malditos-chilenos",
    title: "Malditos chilenos",
    imageSrc: "/memes/meme-1.png",
    alt: "Meme de cultura popular con el texto malditos chilenos arruinaron a Chile.",
    description:
      "Una pieza para el archivo de contradicciones nacionales: nadie se salva de Chile, ni Chile.",
    tags: ["chilenos", "memes", "archivo pop"],
    publishedAt: "2026-05-24"
  },
  {
    slug: "si-saben-como-me-pongo",
    title: "Si saben cómo me pongo",
    imageSrc: "/memes/meme-3.png",
    alt: "Meme chileno con Arturo Vidal y el texto si saben cómo me pongo pa que me dejan salir.",
    description:
      "Clásico de energía post-carrete, fútbol, calle y excusas que nacen listas para compartirse.",
    tags: ["rotos", "futbol", "carrete"],
    publishedAt: "2026-05-24"
  },
  {
    slug: "subele-sin-audifonos",
    title: "Súbele sin audífonos",
    imageSrc: "/memes/meme-4.jpg",
    alt: "Meme de Drake sobre usar audífonos versus escuchar música fuerte sin molestar.",
    description:
      "La banda sonora involuntaria del transporte público, la plaza y cualquier sala de espera chilena.",
    tags: ["rotos", "musica", "convivencia"],
    publishedAt: "2026-05-24"
  },
  {
    slug: "cuico-o-roto",
    title: "Cuico o roto",
    imageSrc: "/memes/meme-5.jpg",
    alt: "Meme de dos botones para elegir entre soy cuico y soy roto.",
    description:
      "La pregunta fundacional del Testómetro: cuando los dos botones parecen peligrosamente correctos.",
    tags: ["cuicos", "rotos", "testometro"],
    publishedAt: "2026-05-24"
  },
  {
    slug: "funas-sin-leer",
    title: "Funas sin leer",
    imageSrc: "/memes/meme-6.jpg",
    alt: "Meme chileno sobre compartir funas sin leerlas.",
    description:
      "Opinión pública express: compartir primero, leer después, matizar nunca.",
    tags: ["chilenos", "redes sociales", "copuchas"],
    publishedAt: "2026-05-24"
  }
];
