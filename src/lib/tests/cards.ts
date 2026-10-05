import { catalogTests } from "@/data/test-catalog";
import { getTestBySlug, tests } from "@/data/tests";
import { getTestHeadline } from "@/lib/share/share-copy";
import { getDurationLabel } from "./duration";
import { getFeaturedTest } from "./featured";

// Datos de las tarjetas de test (home, catálogo, error), sin las preguntas,
// para poder pasarlos a componentes de navegador sin cargar los tests enteros.
export type TestCardData = {
  slug: string;
  title: string;
  headline: string;
  label: string;
  questionCount: number;
  durationLabel: string;
  href: string;
  startHref: string;
  rankingHref: string;
};

export function getTestCard(slug: string): TestCardData | null {
  const test = getTestBySlug(slug);
  if (!test) return null;
  const catalogTest = catalogTests.find((item) => item.slug === slug);

  return {
    slug,
    title: test.title,
    headline: getTestHeadline(test.slug, test.title),
    label: catalogTest?.label ?? "Disponible",
    questionCount: test.questions.length,
    durationLabel: getDurationLabel(test),
    href: `/tests/${slug}`,
    startHref: `/tests/${slug}/start`,
    rankingHref: catalogTest?.rankingHref ?? `/rankings#ranking-${slug}`
  };
}

// Orden de las tarjetas: el destacado primero; después los más cortos, con
// el Original (150 preguntas) al final.
export function getOrderedTestCards() {
  const featured = getFeaturedTest();
  const others = tests
    .filter((test) => test.slug !== featured.slug)
    .sort((a, b) => a.questions.length - b.questions.length);
  return [featured, ...others]
    .map((test) => getTestCard(test.slug))
    .filter((card): card is TestCardData => card !== null);
}

// Pasos de "cómo funciona" (home y portada de cada test).
export const howItWorks = [
  "Respondes sí o no, sin registro.",
  "La aguja marca tu resultado.",
  "Desafías a tu grupo por WhatsApp."
];
