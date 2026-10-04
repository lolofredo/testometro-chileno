import { catalogTests } from "@/data/test-catalog";
import { getTestBySlug } from "@/data/tests";

// Test destacado: el marcado "Nuevo" en el catálogo; si no hay novedad, el
// Cuicómetro (según Search Console, el que más tráfico trae de Google).
export function getFeaturedTest() {
  const featuredSlug =
    catalogTests.find((item) => item.label === "Nuevo")?.slug ?? "cuicometro";
  return getTestBySlug(featuredSlug) ?? getTestBySlug("cuicometro")!;
}
