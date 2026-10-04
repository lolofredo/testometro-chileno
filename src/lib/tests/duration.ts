import type { TestDefinition } from "./types";

// Duración estimada: ~3,2 segundos por pregunta (50 → 3 min, 150 → 8 min).
// Ajustar con la mediana real de los eventos cuando haya datos.
const secondsPerQuestion = 3.2;

export function getEstimatedMinutesForCount(questionCount: number) {
  return Math.max(1, Math.ceil((questionCount * secondsPerQuestion) / 60));
}

export function getEstimatedMinutes(test: Pick<TestDefinition, "questions">) {
  return getEstimatedMinutesForCount(test.questions.length);
}

export function getDurationLabel(test: Pick<TestDefinition, "questions">) {
  return `${getEstimatedMinutes(test)} min`;
}
