"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";
import { getInvitation } from "@/lib/share/share-copy";
import { getDurationLabel } from "@/lib/tests/duration";
import { testThemeStyle } from "@/lib/tests/theme";
import type { TestDefinition } from "@/lib/tests/types";

// Tarjeta "Siguiente test" del resultado, en el color de ese test: uno que la
// persona no ha hecho.
export function NextTestCard({
  nextTest,
  alreadyDidAll,
  sessionId
}: {
  nextTest: TestDefinition;
  alreadyDidAll: boolean;
  sessionId: string;
}) {
  const invitation = getInvitation(nextTest.slug, nextTest.title);

  return (
    <Link
      className="focus-ring grid gap-2.5 rounded-[18px] bg-test p-4 text-test-on shadow-[0_0_0_2px_rgba(23,18,15,0.25)] transition hover:-translate-y-0.5 sm:p-5"
      href={`/tests/${nextTest.slug}/start`}
      onClick={() => trackEvent("next_test_click", { testSlug: nextTest.slug, sessionId })}
      style={testThemeStyle(nextTest.slug)}
    >
      <span className="text-[11px] font-black uppercase tracking-[0.09em]">
        {alreadyDidAll ? "Otro test" : "Siguiente test"}
      </span>
      <span className="display text-[22px] sm:text-3xl">{invitation.question}</span>
      <span className="text-[13px] font-bold">
        {nextTest.title} · {nextTest.questions.length} preguntas · {getDurationLabel(nextTest)}
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm font-black uppercase">
        {invitation.cta}
        <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
      </span>
    </Link>
  );
}
