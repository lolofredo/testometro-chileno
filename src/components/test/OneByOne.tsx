"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { AnswerValue, TestDefinition } from "@/lib/tests/types";

// Formato "una por pantalla": pregunta grande, SÍ y NO del mismo peso, avance
// automático al responder. En computador también con las teclas S, N y ←.
export function OneByOne({
  test,
  answers,
  index,
  onAnswer,
  onIndexChange
}: {
  test: TestDefinition;
  answers: Record<string, AnswerValue>;
  index: number;
  onAnswer: (questionOrder: number, answer: AnswerValue) => void;
  // Avanza o retrocede; un índice igual al total significa "terminé".
  onIndexChange: (nextIndex: number) => void;
}) {
  const total = test.questions.length;
  const question = test.questions[index];
  const current = question ? answers[String(question.displayOrder)] : undefined;
  const [pressed, setPressed] = useState<AnswerValue | null>(null);
  const timer = useRef<number | null>(null);

  const answer = useCallback(
    (value: AnswerValue) => {
      if (!question || timer.current !== null) return;
      onAnswer(question.displayOrder, value);
      setPressed(value);
      // Un instante para ver el botón marcado antes de pasar a la siguiente.
      timer.current = window.setTimeout(() => {
        timer.current = null;
        setPressed(null);
        onIndexChange(index + 1);
      }, 180);
    },
    [index, onAnswer, onIndexChange, question]
  );

  const goBack = useCallback(() => {
    if (index > 0 && timer.current === null) onIndexChange(index - 1);
  }, [index, onIndexChange]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target instanceof HTMLInputElement) return;
      const key = event.key.toLowerCase();
      if (key === "s") answer("yes");
      else if (key === "n") answer("no");
      else if (event.key === "ArrowLeft") goBack();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, goBack]);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  if (!question) return null;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-[max(20px,env(safe-area-inset-bottom))] lg:justify-center">
      <div aria-hidden="true" className="min-h-0 flex-1 overflow-hidden pt-5 lg:flex-none lg:pb-4">
        <span
          className="block font-display text-[150px] leading-[0.8] tracking-[-0.03em] sm:text-[180px]"
          style={{ color: "transparent", WebkitTextStroke: "3px var(--test-on)", opacity: 0.45 }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="grid gap-3.5">
        <div className="rounded-[18px] bg-paper p-5 pb-6 text-ink shadow-[0_8px_0_#17120f]">
          <p className="text-[11px] font-black uppercase tracking-[0.09em] text-test-text">
            Pregunta {index + 1} de {total}
          </p>
          <h1 aria-live="polite" className="mt-2.5 text-2xl font-extrabold leading-tight sm:text-[28px]">
            {question.text}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(["yes", "no"] as const).map((value) => {
            const selected = pressed ? pressed === value : current === value;
            return (
              <button
                aria-pressed={current === value}
                className={`focus-ring h-[92px] rounded-2xl font-display text-[32px] uppercase transition-colors ${
                  selected ? "bg-paper text-ink ring-[3px] ring-inset ring-ink" : "bg-ink text-paper"
                }`}
                key={value}
                onClick={() => answer(value)}
                type="button"
              >
                {value === "yes" ? "Sí" : "No"}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[13px] font-black uppercase tracking-[0.03em]">
          <button
            className="focus-ring -ml-2 inline-flex min-h-11 items-center gap-0.5 rounded-lg pl-1 pr-2 disabled:opacity-40"
            disabled={index === 0}
            onClick={goBack}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={18} strokeWidth={2.8} />
            Anterior
          </button>
          <span className="font-bold normal-case tracking-normal opacity-75">Se guarda solo</span>
        </div>
      </div>
    </div>
  );
}
