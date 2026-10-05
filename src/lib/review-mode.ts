// Modo revisión: para que Juan pruebe el sitio sin que sus visitas cuenten.
// Se activa con ?revisar=una o ?revisar=bloques (fuerza ese formato de
// preguntas) y se apaga con ?revisar=no. Queda guardado en este navegador.
// Mientras está activo no se anota ningún evento, respuesta ni ranking.

export type QuestionFormat = "una" | "bloques";

const reviewKey = "testometro:revisar";

export const questionFormatLabels: Record<QuestionFormat, string> = {
  una: "una por pantalla",
  bloques: "bloques de 10"
};

function isQuestionFormat(value: unknown): value is QuestionFormat {
  return value === "una" || value === "bloques";
}

// Lee ?revisar= de la dirección y lo guarda (o lo borra).
export function captureReviewMode(href: string) {
  try {
    const value = new URL(href).searchParams.get("revisar");
    if (value === null) return;
    if (isQuestionFormat(value)) {
      window.localStorage.setItem(reviewKey, value);
    } else if (value === "no" || value === "apagar") {
      window.localStorage.removeItem(reviewKey);
    }
  } catch {
    // Sin localStorage no hay modo revisión.
  }
}

// Formato forzado por el modo revisión, o null si no está activo.
export function getReviewFormat(): QuestionFormat | null {
  try {
    const value = window.localStorage.getItem(reviewKey);
    return isQuestionFormat(value) ? value : null;
  } catch {
    return null;
  }
}

export function isReviewMode() {
  return getReviewFormat() !== null;
}
