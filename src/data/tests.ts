import { rotometroOriginal } from "./rotometro-original";
import { rotometro2 } from "./rotometro-2";
import { cuicometro } from "./cuicometro";

export const tests = [rotometroOriginal, rotometro2, cuicometro];

export function getTestBySlug(slug: string) {
  return tests.find((test) => test.slug === slug);
}
