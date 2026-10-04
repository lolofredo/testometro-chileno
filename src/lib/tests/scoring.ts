import type { AnswerValue, ResultRange, TestDefinition } from "./types";

export function calculateScore(
  test: TestDefinition,
  answers: Record<string, AnswerValue>
) {
  return test.questions.reduce((total, question) => {
    const answer = answers[String(question.displayOrder)];
    if (answer === "yes") {
      return total + question.pointsYes;
    }

    if (answer === "no") {
      return total + question.pointsNo;
    }

    return total;
  }, 0);
}

// Puntaje mínimo y máximo posibles del test.
export function getScoreBounds(test: TestDefinition) {
  return test.questions.reduce(
    (bounds, question) => ({
      min: bounds.min + Math.min(question.pointsYes, question.pointsNo),
      max: bounds.max + Math.max(question.pointsYes, question.pointsNo)
    }),
    { min: 0, max: 0 }
  );
}

export function getAnsweredCount(
  test: TestDefinition,
  answers: Record<string, AnswerValue>
) {
  return test.questions.filter(
    (question) => answers[String(question.displayOrder)] !== undefined
  ).length;
}

export function getResultRange(test: TestDefinition, score: number): ResultRange {
  const result = test.resultRanges.find((range) => {
    const aboveMin = score >= range.minScore;
    const belowMax = range.maxScore === null || score <= range.maxScore;
    return aboveMin && belowMax;
  });

  return result ?? test.resultRanges[test.resultRanges.length - 1];
}

export function chunkQuestions<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}
