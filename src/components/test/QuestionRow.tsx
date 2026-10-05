"use client";

import type { AnswerValue, TestQuestion } from "@/lib/tests/types";

// Pregunta del formato en bloques. SÍ y NO pesan lo mismo: ninguno se ve
// como la opción recomendada, y la respuesta elegida se marca igual.
export function QuestionRow({
  question,
  value,
  missing,
  onAnswer
}: {
  question: TestQuestion;
  value?: AnswerValue;
  missing: boolean;
  onAnswer: (answer: AnswerValue) => void;
}) {
  return (
    <div
      className={`scroll-mt-28 rounded-[14px] bg-paper p-3 pl-3.5 text-ink ${
        missing ? "outline-dashed outline-[3px] outline-offset-[3px] outline-ink" : ""
      }`}
      id={`pregunta-${question.displayOrder}`}
    >
      <p className="text-[15.5px] font-extrabold leading-snug">
        <span className="mr-1 font-black text-muted">{question.displayOrder}.</span>
        {question.text}
      </p>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {(["yes", "no"] as const).map((answer) => (
          <button
            aria-pressed={value === answer}
            className={`focus-ring h-[52px] rounded-[11px] border-2 border-ink font-display text-lg uppercase transition-colors ${
              value === answer ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-ink/5"
            }`}
            key={answer}
            onClick={() => onAnswer(answer)}
            type="button"
          >
            {answer === "yes" ? "Sí" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}
