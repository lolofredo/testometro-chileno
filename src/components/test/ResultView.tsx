"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { ResultCard } from "./ResultCard";
import { ShareButtons, StickyWhatsAppBar } from "./ShareButtons";
import type { StoredSession } from "@/lib/tests/types";
import { getTestBySlug, tests } from "@/data/tests";
import { getInvitation } from "@/lib/share/share-copy";
import { calculateScore, getResultRange } from "@/lib/tests/scoring";
import { getStoredSession } from "@/lib/tests/storage";

export function ResultView({
  sessionId
}: {
  sessionId: string;
}) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSession(getStoredSession(sessionId));
    setLoaded(true);
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
                  {getInvitation(item.slug, item.title).question.replace(/^¿Y tú /, "¿")}
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

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-white px-5 py-3 text-sm font-black uppercase"
          href={`/rankings#ranking-${test.slug}`}
        >
          <Trophy size={18} strokeWidth={3} />
          Ver ranking
        </Link>
        <Link
          className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper"
          href={`/tests/${test.slug}/start`}
        >
          <RotateCcw size={18} strokeWidth={3} />
          Repetir test
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
