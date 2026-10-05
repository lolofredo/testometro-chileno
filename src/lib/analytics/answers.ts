import type { AnswerValue, TestDefinition } from "@/lib/tests/types";
import { canWriteData } from "@/lib/data-writes";
import { getAnalyticsClient } from "./events";

// Respuestas anónimas, solo como contadores (ver supabase/answers.sql). Al
// terminar un test se mandan el test, su versión y una letra por pregunta en
// el orden del test (s = sí, n = no, - = sin responder); la base suma uno a
// los contadores de la semana y no guarda ninguna fila por persona.

export function encodeAnswers(test: TestDefinition, answers: Record<string, AnswerValue>) {
  return test.questions
    .map((question) => {
      const answer = answers[String(question.displayOrder)];
      if (answer === "yes") return "s";
      if (answer === "no") return "n";
      return "-";
    })
    .join("");
}

export function recordAnonymousAnswers(
  test: TestDefinition,
  answers: Record<string, AnswerValue>
) {
  if (!canWriteData()) return;
  const supabase = getAnalyticsClient();
  if (!supabase) return;

  void supabase
    .rpc("record_answers", {
      p_test_slug: test.slug,
      p_test_version: test.version,
      p_answers: encodeAnswers(test, answers)
    })
    .then(({ error }) => {
      if (error) console.warn("Could not record answers", error.message);
    });
}
