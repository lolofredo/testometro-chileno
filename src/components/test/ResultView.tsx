"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, RotateCcw, Trophy } from "lucide-react";
import { ResultCard } from "./ResultCard";
import type { StoredSession, TestDefinition } from "@/lib/tests/types";
import { calculateScore, getResultRange } from "@/lib/tests/scoring";
import { getStoredSession } from "@/lib/tests/storage";

export function ResultView({
  test,
  sessionId
}: {
  test: TestDefinition;
  sessionId: string;
}) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSession(getStoredSession(sessionId));
  }, [sessionId]);

  const resultData = useMemo(() => {
    if (!session) return null;
    const score = calculateScore(test, session.answers);
    const result = getResultRange(test, score);
    return { score, result };
  }, [session, test]);

  async function copyResult() {
    if (!session || !resultData) return;
    const text = `${session.nickname} obtuvo ${resultData.score} puntos en el ${test.title}: ${resultData.result.title}.`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (!session || !resultData) {
    return (
      <div className="mx-auto max-w-2xl border-4 border-ink bg-paper p-6 text-center shadow-[8px_8px_0_#17120f]">
        <p className="mb-4 text-xl font-black uppercase">No encontre este resultado</p>
        <Link
          className="focus-ring inline-flex border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper"
          href="/tests/rotometro-original/start"
        >
          Hacer el test
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ResultCard
        nickname={session.nickname}
        score={resultData.score}
        result={resultData.result}
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button
          className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-mustard px-5 py-3 text-sm font-black uppercase shadow-[5px_5px_0_#17120f]"
          type="button"
          onClick={copyResult}
        >
          <Copy size={18} strokeWidth={3} />
          {copied ? "Copiado" : "Copiar resultado"}
        </button>
        <Link
          className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-white px-5 py-3 text-sm font-black uppercase"
          href="/rankings/rotometro-original"
        >
          <Trophy size={18} strokeWidth={3} />
          Ver ranking
        </Link>
        <Link
          className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper"
          href="/tests/rotometro-original/start"
        >
          <RotateCcw size={18} strokeWidth={3} />
          Repetir test
        </Link>
      </div>
    </div>
  );
}
