"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Pause } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { QuestionRow } from "./QuestionRow";
import type { AnswerValue, StoredSession, TestDefinition } from "@/lib/tests/types";
import { calculateScore, chunkQuestions, getAnsweredCount, getResultRange } from "@/lib/tests/scoring";
import { addRemoteLeaderboardEntry } from "@/lib/supabase/leaderboard";
import { cleanShareNickname, RANKING_NICKNAME_MAX_LENGTH } from "@/lib/share/nickname";
import { trackEvent } from "@/lib/analytics/events";
import {
  addLeaderboardEntry,
  clearAnswer,
  completeSession,
  getActiveSessionId,
  getStoredSession,
  saveStoredSession,
  setAnswer,
  setCurrentBlock
} from "@/lib/tests/storage";

const blockSize = 10;

export function TestPlayer({ test }: { test: TestDefinition }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<StoredSession | null>(null);

  const blocks = useMemo(() => chunkQuestions(test.questions, blockSize), [test.questions]);
  const blockIndex = Math.min(session?.currentBlock ?? 0, blocks.length - 1);
  const currentQuestions = blocks[blockIndex] ?? [];
  const answered = session ? getAnsweredCount(test, session.answers) : 0;

  useEffect(() => {
    const sessionId =
      searchParams.get("session") ?? getActiveSessionId(test.slug) ?? undefined;
    const stored = sessionId ? getStoredSession(sessionId) : null;

    if (!stored || stored.testSlug !== test.slug) {
      router.replace(`/tests/${test.slug}/start`);
      return;
    }

    setSession(stored);
  }, [router, searchParams, test.slug]);

  function answerQuestion(questionOrder: number, answer: AnswerValue) {
    if (!session) return;

    if (session.answers[String(questionOrder)] === answer) {
      setSession(clearAnswer(session, questionOrder));
      return;
    }

    setSession(setAnswer(session, questionOrder, answer));
  }

  // Un evento por bloque terminado, para ver en qué bloque se abandona.
  function trackBlockCompleted(completedSession: StoredSession, block: number) {
    trackEvent("block_completed", {
      testSlug: test.slug,
      sessionId: completedSession.sessionId,
      block,
      fromShare: completedSession.fromShare
    });
  }

  function goToNextBlock() {
    if (!session) return;
    trackBlockCompleted(session, blockIndex + 1);
    goToBlock(blockIndex + 1);
  }

  function goToBlock(nextBlock: number) {
    if (!session) return;
    const bounded = Math.max(0, Math.min(nextBlock, blocks.length - 1));
    setSession(setCurrentBlock(session, bounded));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function finishTest() {
    if (!session) return;

    const alreadyCompleted = Boolean(session.completedAt);
    const completed = completeSession(session);
    const score = calculateScore(test, completed.answers);
    const result = getResultRange(test, score);

    if (!alreadyCompleted) {
      trackBlockCompleted(completed, blocks.length);
      trackEvent("test_completed", {
        testSlug: test.slug,
        sessionId: completed.sessionId,
        score,
        fromShare: completed.fromShare,
        origin: completed.origin
      });
    }

    if (completed.isPublic) {
      const leaderboardEntry = {
        sessionId: completed.sessionId,
        testSlug: completed.testSlug,
        nickname: cleanShareNickname(completed.nickname, RANKING_NICKNAME_MAX_LENGTH),
        score,
        groupTitle: result.title,
        completedAt: completed.completedAt ?? new Date().toISOString()
      };

      addLeaderboardEntry(leaderboardEntry);
      await addRemoteLeaderboardEntry(leaderboardEntry);
    }

    saveStoredSession(completed);
    router.push(`/results/${completed.sessionId}`);
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl border-4 border-ink bg-paper p-6 text-center font-black uppercase shadow-[8px_8px_0_#17120f]">
        Cargando test...
      </div>
    );
  }

  const isLastBlock = blockIndex === blocks.length - 1;

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-5 border-4 border-ink bg-paper p-5 shadow-[8px_8px_0_#17120f]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-tomato">
              Bloque {blockIndex + 1} de {blocks.length}
            </p>
            <h1 className="text-3xl font-black uppercase leading-none">
              {test.title}
            </h1>
          </div>
          <Link
            className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-white px-4 py-2 text-sm font-black uppercase hover:bg-mustard"
            href={`/tests/${test.slug}`}
          >
            <Pause size={16} strokeWidth={3} />
            Guardar y salir
          </Link>
        </div>
        <ProgressBar answered={answered} total={test.questions.length} />
      </div>

      <div className="mb-5 border-4 border-ink bg-paper p-4 shadow-[8px_8px_0_#17120f] sm:p-6">
        {currentQuestions.map((question) => (
          <QuestionRow
            key={question.displayOrder}
            question={question}
            value={session.answers[String(question.displayOrder)]}
            onAnswer={(answer) => answerQuestion(question.displayOrder, answer)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-white px-5 py-3 text-sm font-black uppercase disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          disabled={blockIndex === 0}
          onClick={() => goToBlock(blockIndex - 1)}
        >
          <ArrowLeft size={18} strokeWidth={3} />
          Anterior
        </button>

        {isLastBlock ? (
          <button
            className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-mint px-5 py-3 text-sm font-black uppercase shadow-[5px_5px_0_#17120f]"
            type="button"
            onClick={finishTest}
          >
            Ver resultado
            <CheckCircle2 size={18} strokeWidth={3} />
          </button>
        ) : (
          <button
            className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper shadow-[5px_5px_0_#17120f]"
            type="button"
            onClick={goToNextBlock}
          >
            Siguiente bloque
            <ArrowRight size={18} strokeWidth={3} />
          </button>
        )}
      </div>
    </section>
  );
}
