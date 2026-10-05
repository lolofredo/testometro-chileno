import { rotometroOriginal } from "./rotometro-original";
import { rotometro2 } from "./rotometro-2";
import { cuicometro } from "./cuicometro";
import { chantometro } from "./chantometro";
import { farandulometro } from "./farandulometro";

export const tests = [rotometroOriginal, rotometro2, cuicometro, chantometro, farandulometro];

export function getTestBySlug(slug: string) {
  return tests.find((test) => test.slug === slug);
}
