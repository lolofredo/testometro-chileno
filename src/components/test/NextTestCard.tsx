"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";
import { getInvitation } from "@/lib/share/share-copy";
import { getDurationLabel } from "@/lib/tests/duration";
import type { TestDefinition } from "@/lib/tests/types";

// Tarjeta "Siguiente test" del resultado: un test que la persona no ha hecho.
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
    <section className="mt-6 border-4 border-ink bg-mustard p-5 shadow-[8px_8px_0_#17120f] sm:p-6">
      <p className="mb-2 text-xs font-black uppercase text-ink/70">
        {alreadyDidAll ? "Otro test" : "Siguiente test"}
      </p>
      <p className="text-3xl font-black uppercase leading-none sm:text-4xl">{invitation.question}</p>
      <p className="mt-2 text-sm font-bold text-ink/75">
        {nextTest.title} · {nextTest.questions.length} preguntas · {getDurationLabel(nextTest)}
      </p>
      <Link
        className="focus-ring mt-4 flex w-full items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-4 text-base font-black uppercase text-paper shadow-[5px_5px_0_#17120f] transition hover:-translate-y-0.5 sm:w-auto sm:px-8"
        href={`/tests/${nextTest.slug}/start`}
        onClick={() => trackEvent("next_test_click", { testSlug: nextTest.slug, sessionId })}
      >
        {invitation.cta}
        <ArrowRight size={20} strokeWidth={3} />
      </Link>
    </section>
  );
}
