import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { TestCardData } from "@/lib/tests/cards";
import { getTestTheme, testThemeStyle } from "@/lib/tests/theme";

// Test destacado: bloque grande del color del test con su botón "Empezar".
export function FeaturedTest({ card, size = "md" }: { card: TestCardData; size?: "md" | "lg" }) {
  const label = card.label === "Nuevo" ? "Nuevo" : "Destacado";
  // Sobre un test amarillo la etiqueta amarilla no se vería.
  const chipClass =
    getTestTheme(card.slug).bg === "#f3b61f" ? "bg-ink text-paper" : "bg-mustard text-ink";

  return (
    <article
      className={`grid gap-3 rounded-[18px] bg-test text-test-on ${size === "lg" ? "p-6" : "p-[18px]"}`}
      style={testThemeStyle(card.slug)}
    >
      <p className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.06em] ${chipClass}`}>
          {label}
        </span>
        <span className="text-[11px] font-black uppercase tracking-[0.09em]">{card.title}</span>
      </p>
      <h2 className={`display ${size === "lg" ? "text-[44px]" : "text-[28px] sm:text-4xl"}`}>{card.headline}</h2>
      <p className="text-sm font-bold opacity-95">
        {card.questionCount} preguntas de sí o no · {card.durationLabel}
      </p>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
        <Link
          className="focus-ring flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-xl bg-paper px-6 text-[15px] font-black uppercase tracking-[0.03em] text-ink shadow-lift transition hover:-translate-y-0.5"
          href={card.startHref}
        >
          Empezar
          <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
        </Link>
        <Link
          className="focus-ring inline-flex min-h-11 items-center justify-center text-[13px] font-black uppercase underline decoration-2 underline-offset-4"
          href={card.rankingHref}
        >
          Ver ranking
        </Link>
      </div>
    </article>
  );
}
