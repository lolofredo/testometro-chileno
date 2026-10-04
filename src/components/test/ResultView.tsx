"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RotateCcw, Trophy } from "lucide-react";
import { ResultCard } from "./ResultCard";
import { ShareButtons, StickyWhatsAppBar } from "./ShareButtons";
import type { StoredSession } from "@/lib/tests/types";
import { getTestBySlug } from "@/data/tests";
import { calculateScore, getResultRange } from "@/lib/tests/scoring";
import { getStoredSession } from "@/lib/tests/storage";

export function ResultView({
  sessionId
}: {
  sessionId: string;
}) {
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    setSession(getStoredSession(sessionId));
  }, [sessionId]);

  const test = session ? getTestBySlug(session.testSlug) : undefined;

  const resultData = useMemo(() => {
    if (!session || !test) return null;
    const score = calculateScore(test, session.answers);
    const result = getResultRange(test, score);
    return { score, result };
  }, [session, test]);

  if (!session || !test || !resultData) {
    return (
      <div className="mx-auto max-w-2xl border-4 border-ink bg-paper p-6 text-center shadow-[8px_8px_0_#17120f]">
        <p className="mb-4 text-xl font-black uppercase">No encontre este resultado</p>
        <Link
          className="focus-ring inline-flex border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper"
          href="/tests"
        >
          Ver tests
        </Link>
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
