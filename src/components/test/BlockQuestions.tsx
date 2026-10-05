"use client";

import { useState } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { QuestionRow } from "./QuestionRow";
import type { AnswerValue, TestQuestion } from "@/lib/tests/types";

function scrollToQuestion(order: number) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(`pregunta-${order}`)
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
}

// Formato en bloques de 10: al responder baja solo a la siguiente pregunta
// sin responder, y antes de pasar de bloque avisa si faltan preguntas.
export function BlockQuestions({
  questions,
  answers,
  blockIndex,
  blockCount,
  onAnswer,
  onPrevious,
  onNext
}: {
  questions: TestQuestion[];
  answers: Record<string, AnswerValue>;
  blockIndex: number;
  blockCount: number;
  onAnswer: (questionOrder: number, answer: AnswerValue) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  // Primer toque en "Siguiente" con preguntas sin responder: solo avisa.
  const [warnedBlock, setWarnedBlock] = useState<number | null>(null);
  const isLastBlock = blockIndex === blockCount - 1;

  const missing = questions.filter((question) => !answers[String(question.displayOrder)]);
  const lastAnsweredPosition = questions.reduce(
    (last, question, position) => (answers[String(question.displayOrder)] ? position : last),
    -1
  );
  // Saltó alguna: hay una sin responder antes de la última respondida.
  const skipped = questions.some(
    (question, position) => position < lastAnsweredPosition && !answers[String(question.displayOrder)]
  );
  const showWarning = missing.length > 0 && (skipped || warnedBlock === blockIndex);

  function answer(question: TestQuestion, value: AnswerValue) {
    const wasUnanswered = !answers[String(question.displayOrder)];
    onAnswer(question.displayOrder, value);
    if (!wasUnanswered) return;

    const position = questions.indexOf(question);
    const nextMissing =
      questions.find((item, index) => index > position && !answers[String(item.displayOrder)]) ??
      questions.find((item, index) => index < position && !answers[String(item.displayOrder)]);
    if (nextMissing) {
      scrollToQuestion(nextMissing.displayOrder);
    } else {
      document.getElementById("siguiente-bloque")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function next() {
    if (missing.length > 0 && warnedBlock !== blockIndex) {
      setWarnedBlock(blockIndex);
      scrollToQuestion(missing[0].displayOrder);
      return;
    }
    onNext();
  }

  return (
    <div className="mx-auto grid w-full max-w-xl gap-2.5 px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-1">
      {questions.map((question) => (
        <QuestionRow
          key={question.displayOrder}
          missing={showWarning && !answers[String(question.displayOrder)]}
          onAnswer={(value) => answer(question, value)}
          question={question}
          value={answers[String(question.displayOrder)]}
        />
      ))}

      {showWarning ? (
        <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-ink px-3.5 py-3 text-sm font-extrabold text-paper" role="status">
          <span>
            {missing.length === 1
              ? "Te falta 1 pregunta de este bloque"
              : `Te faltan ${missing.length} preguntas de este bloque`}
          </span>
          <button
            className="focus-ring shrink-0 rounded text-xs font-black uppercase text-mustard underline decoration-2 underline-offset-[3px]"
            onClick={() => scrollToQuestion(missing[0].displayOrder)}
            type="button"
          >
            Ir a la {missing[0].displayOrder}
          </button>
        </div>
      ) : null}

      <button
        className="focus-ring mt-1 flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-ink text-[15px] font-black uppercase tracking-[0.03em] text-paper"
        id="siguiente-bloque"
        onClick={next}
        type="button"
      >
        {isLastBlock ? "Ver resultado" : "Siguiente bloque"}
        <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
      </button>

      {blockIndex > 0 ? (
        <button
          className="focus-ring inline-flex min-h-11 w-fit items-center gap-0.5 rounded-lg pr-2 text-[13px] font-black uppercase tracking-[0.03em]"
          onClick={onPrevious}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={18} strokeWidth={2.8} />
          Anterior
        </button>
      ) : null}
    </div>
  );
}
