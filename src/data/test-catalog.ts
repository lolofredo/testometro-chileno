import { rotometroOriginal } from "./rotometro-original";
import { rotometro2 } from "./rotometro-2";
import { cuicometro } from "./cuicometro";
import { chantometro } from "./chantometro";

export type CatalogTest = {
  slug: string;
  title: string;
  label: string;
  description: string;
  status: "available" | "coming-soon";
  theme: string;
  rankingDescription: string;
  questionCount?: number;
  blocks?: number;
  href?: string;
  rankingHref?: string;
};

export const catalogTests: CatalogTest[] = [
  {
    slug: rotometroOriginal.slug,
    title: rotometroOriginal.title,
    label: "Disponible",
    description:
      "Revive la reliquia original de los años 2000 del internet chileno.",
    theme: "Archivo pop chileno",
    rankingDescription:
      "Ranking público del Rotómetro Original, conectado a los resultados que la gente decide publicar.",
    status: "available",
    questionCount: rotometroOriginal.questions.length,
    blocks: 15,
    href: `/tests/${rotometroOriginal.slug}`,
    rankingHref: `/rankings#ranking-${rotometroOriginal.slug}`
  },
  {
    slug: rotometro2.slug,
    title: rotometro2.title,
    label: "Disponible",
    description:
      "Prueba tu nivel de rotería, actualizado al Chile digital actual.",
    theme: "Chile digital actual",
    rankingDescription:
      "Ranking público del Rotómetro 2.0, conectado a los resultados que la gente decide publicar.",
    status: "available",
    questionCount: rotometro2.questions.length,
    blocks: 5,
    href: `/tests/${rotometro2.slug}`,
    rankingHref: `/rankings#ranking-${rotometro2.slug}`
  },
  {
    slug: cuicometro.slug,
    title: cuicometro.title,
    label: "Disponible",
    description:
      "¿Qué tan cuico crees que eres? Te podrías sorprender.",
    theme: "Humor de tribus chilenas",
    rankingDescription:
      "Ranking público del Cuicómetro, conectado a los resultados que la gente decide publicar.",
    status: "available",
    questionCount: cuicometro.questions.length,
    blocks: 5,
    href: `/tests/${cuicometro.slug}`,
    rankingHref: `/rankings#ranking-${cuicometro.slug}`
  },
  {
    slug: chantometro.slug,
    title: chantometro.title,
    // "Nuevo" lo destaca y lo pone primero en la home; volver a "Disponible"
    // cuando deje de ser novedad.
    label: "Nuevo",
    description: chantometro.description,
    theme: "Humor de tribus chilenas",
    rankingDescription:
      "Ranking público del Chantómetro, conectado a los resultados que la gente decide publicar.",
    status: "available",
    questionCount: chantometro.questions.length,
    blocks: 5,
    href: `/tests/${chantometro.slug}`,
    rankingHref: `/rankings#ranking-${chantometro.slug}`
  }
];

export function getCatalogTestBySlug(slug: string) {
  return catalogTests.find((test) => test.slug === slug);
}
