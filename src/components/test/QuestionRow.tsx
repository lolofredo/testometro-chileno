"use client";

import type { AnswerValue, TestQuestion } from "@/lib/tests/types";

export function QuestionRow({
  question,
  value,
  onAnswer
}: {
  question: TestQuestion;
  value?: AnswerValue;
  onAnswer: (answer: AnswerValue) => void;
}) {
  return (
    <div className="grid gap-3 border-b-2 border-ink/20 py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="flex gap-3">
        <span className="grid size-8 shrink-0 place-items-center border-2 border-ink bg-white text-sm font-black">
          {question.displayOrder}
        </span>
        <p className="text-base font-bold leading-snug">{question.text}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:w-44">
        <button
          aria-pressed={value === "yes"}
          className={`focus-ring border-4 border-ink px-4 py-2 text-sm font-black uppercase transition ${
            value === "yes"
              ? "bg-mint text-ink shadow-[4px_4px_0_#17120f]"
              : "bg-white hover:bg-mint/30"
          }`}
          type="button"
          onClick={() => onAnswer("yes")}
        >
          Sí
        </button>
        <button
          aria-pressed={value === "no"}
          className={`focus-ring border-4 border-ink px-4 py-2 text-sm font-black uppercase transition ${
            value === "no"
              ? "bg-tomato text-paper shadow-[4px_4px_0_#17120f]"
              : "bg-white hover:bg-tomato/20"
          }`}
          type="button"
          onClick={() => onAnswer("no")}
        >
          No
        </button>
      </div>
    </div>
  );
}
