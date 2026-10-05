"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, RotateCcw, Trophy } from "lucide-react";
import { Gauge } from "@/components/brand/Gauge";
import { GameScreen, GameTopBar } from "@/components/game/GameChrome";
import { NextTestCard } from "./NextTestCard";
import { ShareButtons, StickyWhatsAppBar } from "./ShareButtons";
import type { StoredSession } from "@/lib/tests/types";
import { getTestBySlug, tests } from "@/data/tests";
import { getInvitation, getTestHeadline } from "@/lib/share/share-copy";
import { calculateScore, getResultRange, getScoreBounds } from "@/lib/tests/scoring";
import { getCompletedTestSlugs, getStoredSession, hasChosenNickname } from "@/lib/tests/storage";
import { testThemeStyle } from "@/lib/tests/theme";
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
    return { score, result, bounds: getScoreBounds(test) };
  }, [session, test]);

  if (!loaded) return null;

  if (!session || !test || !resultData) {
    // Links /results/... antiguos: el resultado vive solo en el celular de
    // quien hizo el test. Se convierte en invitación a jugar.
    return (
      <div className="min-h-[100dvh] bg-canvas px-4 py-6">
        <div className="mx-auto max-w-xl">
          <Link
            className="focus-ring -ml-2 inline-flex min-h-11 items-center gap-0.5 rounded-lg pl-1 pr-2 text-[13px] font-black uppercase"
            href="/"
          >
            <ChevronLeft aria-hidden="true" size={18} strokeWidth={2.8} />
            Testómetro
          </Link>
          <p className="mt-4 text-[11px] font-black uppercase tracking-[0.09em] text-tomato">
            Resultado guardado en otro celular
          </p>
          <h1 className="display mt-1 text-3xl sm:text-4xl">
            Este resultado quedó en el celular de quien hizo el test
          </h1>
          <p className="mt-4 font-semibold leading-relaxed text-ink/80">
            No se puede ver desde aquí, pero puedes sacar el tuyo en 3 minutos.
          </p>
          <div className="mt-6 grid gap-3">
            {tests.map((item) => (
              <Link
                key={item.slug}
                className="focus-ring flex items-center justify-between gap-3 rounded-2xl bg-test px-4 py-3.5 text-test-on"
                href={`/tests/${item.slug}`}
                style={testThemeStyle(item.slug)}
              >
                <span>
                  <span className="display block text-lg">{getTestHeadline(item.slug, item.title)}</span>
                  <span className="mt-1 block text-xs font-bold">{item.title}</span>
                </span>
                <ArrowRight aria-hidden="true" className="shrink-0" size={18} strokeWidth={2.8} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { score, result, bounds } = resultData;
  const named = hasChosenNickname(session.nickname);
  const adjective = getInvitation(test.slug, test.title).adjective;
  const shareInput = {
    testSlug: test.slug,
    testTitle: test.title,
    resultTitle: result.title,
    sharePhrase: result.shareText,
    score,
    nickname: session.nickname,
    sessionId: session.sessionId
  };

  return (
    <GameScreen testSlug={test.slug}>
      <GameTopBar center={test.title} exitHref="/" exitLabel="Testómetro" />

      <div className="mx-auto grid w-full max-w-xl gap-4 px-4 pb-6 sm:max-w-5xl sm:grid-cols-2 sm:items-start sm:gap-6 sm:pt-4">
        <div className="grid gap-4">
          <section className="text-center">
            <div className="rounded-t-[180px] rounded-b-[22px] bg-paper px-4 pb-4 pt-6 text-ink">
              <Gauge
                className="mx-auto h-auto w-[250px]"
                size={250}
                sweep
                ticks
                value={(score - bounds.min) / Math.max(1, bounds.max - bounds.min)}
              />
              <p className="mt-1 font-display text-[64px] leading-[0.9]">
                {score}
                <span className="text-2xl">/{bounds.max}</span>
              </p>
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.09em]">
              {named ? `${session.nickname} es oficialmente` : "Eres oficialmente"}
            </p>
            <h1 className="display mt-2 text-[38px] sm:text-5xl">{result.title}</h1>
            <p className="mt-3 text-[15.5px] font-semibold leading-relaxed">{result.description}</p>
          </section>
        </div>

        <div className="grid gap-4">
          <ShareButtons
            {...shareInput}
            title={adjective ? `¿Quién de tu grupo es más ${adjective}?` : "Compártelo y desafía a tus amigos"}
          />

          {nextTest ? (
            <NextTestCard
              alreadyDidAll={nextTest.alreadyDidAll}
              nextTest={nextTest.test}
              sessionId={session.sessionId}
            />
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[13px] font-black uppercase">
            <Link
              className="focus-ring inline-flex min-h-11 items-center gap-2 underline decoration-2 underline-offset-4"
              href={`/rankings#ranking-${test.slug}`}
            >
              <Trophy aria-hidden="true" size={16} strokeWidth={2.6} />
              Ver ranking
            </Link>
            <Link
              className="focus-ring inline-flex min-h-11 items-center gap-2 underline decoration-2 underline-offset-4"
              href={`/tests/${test.slug}/start`}
            >
              <RotateCcw aria-hidden="true" size={16} strokeWidth={2.6} />
              Repetir este test
            </Link>
          </div>
        </div>
      </div>

      <StickyWhatsAppBar {...shareInput} />
    </GameScreen>
  );
}
