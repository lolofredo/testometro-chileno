"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { ResultCard } from "./ResultCard";
import { NextTestCard } from "./NextTestCard";
import { ShareButtons, StickyWhatsAppBar } from "./ShareButtons";
import type { StoredSession } from "@/lib/tests/types";
import { getTestBySlug, tests } from "@/data/tests";
import { getTestHeadline } from "@/lib/share/share-copy";
import { calculateScore, getResultRange } from "@/lib/tests/scoring";
import { getCompletedTestSlugs, getStoredSession } from "@/lib/tests/storage";
import { getFeaturedTest } from "@/lib/tests/featured";
import type { TestDefinition } from "@/lib/tests/types";

// Siguiente test: primero el destacado, después los más cortos (el Original,
// de 150 preguntas, al final), sin repetir el actual y prefiriendo uno que la
// persona no haya terminado.
function pickNextTest(currentSlug: string) {
  const featured = getFeaturedTest();
  const others = tests
    .filter((item) => item.slug !== featured.slug)
    .sort((a, b) => a.questions.length - b.questions.length);
  const candidates = [featured, ...others].filter((item) => item.slug !== currentSlug);
  const completed = getCompletedTestSlugs();
  const notDone = candidates.find((item) => !completed.has(item.slug));
  if (notDone) return { test: notDone, alreadyDidAll: false };
  return candidates[0] ? { test: candidates[0], alreadyDidAll: true } : null;
}

export function ResultView({
  sessionId
}: {
  sessionId: string;
}) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [nextTest, setNextTest] = useState<{ test: TestDefinition; alreadyDidAll: boolean } | null>(
    null
  );

  useEffect(() => {
    const stored = getStoredSession(sessionId);
    setSession(stored);
    setLoaded(true);
    if (stored) setNextTest(pickNextTest(stored.testSlug));
  }, [sessionId]);

  const test = session ? getTestBySlug(session.testSlug) : undefined;

  const resultData = useMemo(() => {
    if (!session || !test) return null;
    const score = calculateScore(test, session.answers);
    const result = getResultRange(test, score);
    return { score, result };
  }, [session, test]);

  if (!loaded) return null;

  if (!session || !test || !resultData) {
    // Links /results/... antiguos: el resultado vive solo en el celular de
    // quien hizo el test. Se convierte en invitación a jugar.
    return (
      <div className="mx-auto max-w-2xl border-4 border-ink bg-paper p-6 shadow-[8px_8px_0_#17120f] sm:p-8">
        <p className="mb-2 text-xs font-black uppercase text-tomato">Resultado guardado en otro celular</p>
        <h1 className="text-3xl font-black uppercase leading-none sm:text-4xl">
          Este resultado quedó en el celular de quien hizo el test
        </h1>
        <p className="mt-4 font-semibold leading-relaxed text-ink/80">
          No se puede ver desde aquí, pero puedes sacar el tuyo en 3 minutos.
        </p>
        <div className="mt-6 grid gap-3">
          {tests.map((item) => (
            <Link
              key={item.slug}
              className="focus-ring flex items-center justify-between gap-3 border-4 border-ink bg-white px-4 py-3 font-black uppercase"
              href={`/tests/${item.slug}`}
            >
              <span>
                <span className="block text-base leading-tight">
                  {getTestHeadline(item.slug, item.title)}
                </span>
                <span className="block text-xs text-ink/60">{item.title}</span>
              </span>
              <ArrowRight className="shrink-0" size={18} strokeWidth={3} />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ResultCard
        nickname={session.nickname}
        testTitle={test.title}
        score={resultData.score}
        result={resultData.result}
      />

      <ShareButtons
        testSlug={test.slug}
        testTitle={test.title}
        resultTitle={resultData.result.title}
        sharePhrase={resultData.result.shareText}
        score={resultData.score}
        nickname={session.nickname}
        sessionId={session.sessionId}
      />

      {nextTest ? (
        <NextTestCard
          alreadyDidAll={nextTest.alreadyDidAll}
          nextTest={nextTest.test}
          sessionId={session.sessionId}
        />
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-black uppercase">
        <Link
          className="focus-ring inline-flex min-h-11 items-center gap-2 underline decoration-2 underline-offset-4"
          href={`/rankings#ranking-${test.slug}`}
        >
          <Trophy size={16} strokeWidth={3} />
          Ver ranking
        </Link>
        <Link
          className="focus-ring inline-flex min-h-11 items-center gap-2 underline decoration-2 underline-offset-4"
          href={`/tests/${test.slug}/start`}
        >
          <RotateCcw size={16} strokeWidth={3} />
          Repetir este test
        </Link>
      </div>

      <StickyWhatsAppBar
        testSlug={test.slug}
        testTitle={test.title}
        resultTitle={resultData.result.title}
        sharePhrase={resultData.result.shareText}
        score={resultData.score}
        nickname={session.nickname}
        sessionId={session.sessionId}
      />
    </div>
  );
}
