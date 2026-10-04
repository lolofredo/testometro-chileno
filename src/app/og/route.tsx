import { tests } from "@/data/tests";
import { renderSitePreview } from "@/lib/share/result-image";
import { getTestHeadline } from "@/lib/share/share-copy";

// Vista previa general del sitio: "¿Qué tan roto, cuico o chanta eres?",
// armada con las preguntas de los tests publicados.
export async function GET() {
  const adjectives = [
    ...new Set(
      tests
        .map((test) => getTestHeadline(test.slug, test.title).match(/^¿Qué tan (.+) eres\?$/)?.[1])
        .filter((value): value is string => Boolean(value))
    )
  ];
  const list =
    adjectives.length > 1
      ? `${adjectives.slice(0, -1).join(", ")} o ${adjectives[adjectives.length - 1]}`
      : (adjectives[0] ?? "chileno");

  return renderSitePreview({ tagline: `¿Qué tan ${list} eres?`, testCount: tests.length });
}
