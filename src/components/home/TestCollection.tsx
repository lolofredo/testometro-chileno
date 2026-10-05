"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { TestCardData } from "@/lib/tests/cards";
import { getCompletedTestSlugs } from "@/lib/tests/storage";
import { testThemeStyle } from "@/lib/tests/theme";

function useCompletedSlugs() {
  const [done, setDone] = useState<Set<string> | null>(null);
  useEffect(() => {
    setDone(getCompletedTestSlugs());
  }, []);
  return done;
}

function ActionLabel({ done }: { done: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-black uppercase tracking-[0.03em]">
      {done ? "Repetir" : "Empezar"}
      <ArrowRight aria-hidden="true" size={16} strokeWidth={2.8} />
    </span>
  );
}

function DoneStamp() {
  return (
    <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-ink px-2 py-1 text-[10px] font-black uppercase tracking-[0.05em] text-paper">
      <Check aria-hidden="true" size={12} strokeWidth={3} />
      Hecho
    </span>
  );
}

// Cuántos tests hizo esta persona en este celular, con un punto por test.
export function CollectionCount({ cards }: { cards: TestCardData[] }) {
  const done = useCompletedSlugs();
  const doneCount = done ? cards.filter((card) => done.has(card.slug)).length : null;

  return (
    <span className="flex items-center gap-2 text-[13px] font-extrabold">
      {doneCount !== null ? `${doneCount} de ${cards.length}` : null}
      <span aria-hidden="true" className="flex gap-1">
        {cards.map((card) => (
          <i
            className={`h-2.5 w-[18px] rounded-[5px] border-2 border-test ${done?.has(card.slug) ? "bg-test" : ""}`}
            key={card.slug}
            style={testThemeStyle(card.slug)}
          />
        ))}
      </span>
    </span>
  );
}

// Bloques de color de la home. `featuredSlug` se oculta en celular, porque
// ahí el destacado ya aparece arriba en grande.
export function TestTiles({ cards, featuredSlug }: { cards: TestCardData[]; featuredSlug?: string }) {
  const done = useCompletedSlugs();
  const mobileCount = cards.filter((card) => card.slug !== featuredSlug).length;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((card, index) => {
        const isDone = Boolean(done?.has(card.slug));
        const mobileIndex = cards.slice(0, index).filter((item) => item.slug !== featuredSlug).length;
        const wideOnMobile = mobileCount % 2 === 1 && mobileIndex === mobileCount - 1;
        return (
          <Link
            className={`focus-ring relative flex min-h-[164px] flex-col justify-between gap-2.5 rounded-2xl bg-test p-3.5 text-test-on transition hover:-translate-y-0.5 lg:min-h-[190px] lg:p-[18px] ${
              card.slug === featuredSlug ? "hidden lg:flex" : ""
            } ${wideOnMobile ? "col-span-2 min-h-0 lg:col-span-1 lg:min-h-[190px]" : ""}`}
            href={card.href}
            key={card.slug}
            style={testThemeStyle(card.slug)}
          >
            {isDone ? <DoneStamp /> : null}
            <h3 className={`display text-[19px] lg:text-[23px] ${isDone ? "mt-6" : ""}`}>{card.headline}</h3>
            <div className={wideOnMobile ? "flex items-end justify-between gap-3 lg:block" : ""}>
              <p className="text-[12.5px] font-extrabold leading-snug opacity-90">
                {card.title}
                <br />
                {card.questionCount} preguntas · {card.durationLabel}
              </p>
              <p className={wideOnMobile ? "lg:mt-2" : "mt-2"}>
                <ActionLabel done={isDone} />
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// Filas de color del catálogo.
export function TestRows({ cards }: { cards: TestCardData[] }) {
  const done = useCompletedSlugs();

  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      {cards.map((card) => {
        const isDone = Boolean(done?.has(card.slug));
        return (
          <Link
            className="focus-ring relative flex items-end justify-between gap-3 rounded-2xl bg-test p-4 text-test-on transition hover:-translate-y-0.5 sm:p-5"
            href={card.href}
            key={card.slug}
            style={testThemeStyle(card.slug)}
          >
            {isDone ? <DoneStamp /> : null}
            <div className="min-w-0">
              <h2>
                <span className={`display block text-[22px] sm:text-3xl ${isDone ? "pr-16" : ""}`}>{card.headline}</span>
                <span className="mt-2 block text-[13px] font-extrabold leading-snug">{card.title}</span>
              </h2>
              <p className="text-[13px] font-extrabold leading-snug">
                {card.questionCount} preguntas · {card.durationLabel}
              </p>
            </div>
            <span className="shrink-0">
              <ActionLabel done={isDone} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
