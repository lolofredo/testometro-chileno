import { getReviewFormat, type QuestionFormat } from "@/lib/review-mode";
import type { StoredSession, TestDefinition } from "./types";

export type { QuestionFormat };

// Prueba A/B del formato de preguntas: "una" (una por pantalla) o "bloques"
// (bloques de 10). Cada celular recibe uno al azar, mitad y mitad, y lo
// mantiene en todos los tests. El Original siempre va en bloques.
//
// Para apagar la prueba y dejar a todos con el ganador, cambiar null por
// "una" o "bloques" (un commit de una línea). Después se puede borrar el
// código del perdedor.
export const winningFormat: QuestionFormat | null = null;

const assignedKey = "testometro:formato";

export function isInFormatTest(test: Pick<TestDefinition, "slug">) {
  return test.slug !== "rotometro-original";
}

function getAssignedFormat(): QuestionFormat {
  try {
    const stored = window.localStorage.getItem(assignedKey);
    if (stored === "una" || stored === "bloques") return stored;
    const assigned: QuestionFormat = Math.random() < 0.5 ? "una" : "bloques";
    window.localStorage.setItem(assignedKey, assigned);
    return assigned;
  } catch {
    return "bloques";
  }
}

// Formato con que esta persona responde este test. El modo revisión manda;
// después el ganador si ya se eligió; después el de la sesión (para que no
// cambie a mitad de un test); después el asignado a este celular.
export function chooseQuestionFormat(
  test: Pick<TestDefinition, "slug">,
  session?: Pick<StoredSession, "format"> | null
): QuestionFormat {
  if (!isInFormatTest(test)) return "bloques";
  const review = getReviewFormat();
  if (review) return review;
  if (winningFormat) return winningFormat;
  if (session?.format) return session.format;
  return getAssignedFormat();
}
