"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GameProgress, GameScreen, GameTopBar } from "@/components/game/GameChrome";
import { BlockQuestions } from "./BlockQuestions";
import { NameStep } from "./NameStep";
import { OneByOne } from "./OneByOne";
import type { AnswerValue, StoredSession, TestDefinition } from "@/lib/tests/types";
import { calculateScore, chunkQuestions, getAnsweredCount, getResultRange } from "@/lib/tests/scoring";
import { chooseQuestionFormat, isInFormatTest, type QuestionFormat } from "@/lib/tests/question-format";
import { addRemoteLeaderboardEntry } from "@/lib/supabase/leaderboard";
import { cleanShareNickname, RANKING_NICKNAME_MAX_LENGTH } from "@/lib/share/nickname";
import { trackEvent } from "@/lib/analytics/events";
import { recordAnonymousAnswers } from "@/lib/analytics/answers";
import { getReviewFormat } from "@/lib/review-mode";
import {
  addLeaderboardEntry,
  clearAnswer,
  completeSession,
  getActiveSessionId,
  getLastNameChoice,
  getStoredSession,
  hasChosenNickname,
  saveLastNameChoice,
  saveStoredSession,
  setAnswer,
  setCurrentBlock,
  setCurrentQuestion
} from "@/lib/tests/storage";

const blockSize = 10;

function firstUnansweredIndex(test: TestDefinition, answers: Record<string, AnswerValue>) {
  const index = test.questions.findIndex((question) => !answers[String(question.displayOrder)]);
  return index === -1 ? test.questions.length - 1 : index;
}

export function TestPlayer({ test }: { test: TestDefinition }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSessionState] = useState<StoredSession | null>(null);
  const [format, setFormat] = useState<QuestionFormat>("bloques");
  const [stage, setStage] = useState<"questions" | "name">("questions");
  const [finishing, setFinishing] = useState(false);
  const [nameDefaults, setNameDefaults] = useState({ nickname: "", isPublic: false });
  // La sesión más reciente, para los avances con retraso (formato "una").
  const sessionRef = useRef<StoredSession | null>(null);
  // Bloques ya anotados en esta visita, para no repetir el evento.
  const trackedBlocks = useRef(new Set<number>());

  const blocks = useMemo(() => chunkQuestions(test.questions, blockSize), [test.questions]);
  const exitHref = `/tests/${test.slug}`;

  const update = useCallback((next: StoredSession) => {
    sessionRef.current = next;
    setSessionState(next);
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session") ?? getActiveSessionId(test.slug) ?? undefined;
    const stored = sessionId ? getStoredSession(sessionId) : null;

    if (!stored || stored.testSlug !== test.slug) {
      router.replace(`/tests/${test.slug}/start`);
      return;
    }
    if (stored.completedAt) {
      router.replace(`/results/${stored.sessionId}`);
      return;
    }

    const chosen = chooseQuestionFormat(test, stored);
    // Sesiones de antes de la prueba A/B: se anota el formato con que siguen
    // (salvo en modo revisión, que no debe quedar pegado a la sesión).
    let ready = stored;
    if (!stored.format && isInFormatTest(test) && !getReviewFormat()) {
      ready = { ...stored, format: chosen };
      saveStoredSession(ready);
    }
    if (chosen === "una" && ready.currentQuestion === undefined) {
      ready = { ...ready, currentQuestion: firstUnansweredIndex(test, ready.answers) };
    }

    // Nombre al final: el de esta sesión si vino de antes, o el último usado.
    const last = getLastNameChoice();
    setNameDefaults(
      hasChosenNickname(ready.nickname)
        ? { nickname: ready.nickname, isPublic: ready.isPublic }
        : { nickname: last.nickname, isPublic: ready.isPublic || last.isPublic }
    );

    setFormat(chosen);
    update(ready);
  }, [router, searchParams, test, update]);

  const trackBlockCompleted = useCallback(
    (block: number) => {
      const current = sessionRef.current;
      if (!current || trackedBlocks.current.has(block)) return;
      trackedBlocks.current.add(block);
      trackEvent("block_completed", {
        testSlug: test.slug,
        sessionId: current.sessionId,
        block,
        fromShare: current.fromShare,
        format
      });
    },
    [format, test.slug]
  );

  const showNameStep = useCallback(() => {
    // Terminar las preguntas cuenta como terminar el último bloque.
    trackBlockCompleted(blocks.length);
    setStage("name");
    window.scrollTo({ top: 0 });
  }, [blocks.length, trackBlockCompleted]);

  // Formato "una": responder fija la respuesta (no la borra si se repite).
  const answerOne = useCallback(
    (questionOrder: number, answer: AnswerValue) => {
      const current = sessionRef.current;
      if (current) update(setAnswer(current, questionOrder, answer));
    },
    [update]
  );

  const changeIndex = useCallback(
    (nextIndex: number) => {
      const current = sessionRef.current;
      if (!current) return;
      const previous = current.currentQuestion ?? 0;
      // Pasar de la pregunta 10, 20, 30... cuenta como terminar un bloque.
      if (nextIndex > previous && nextIndex % blockSize === 0 && nextIndex < test.questions.length) {
        trackBlockCompleted(nextIndex / blockSize);
      }
      if (nextIndex >= test.questions.length) {
        showNameStep();
        return;
      }
      update(setCurrentQuestion(current, nextIndex));
    },
    [showNameStep, test.questions.length, trackBlockCompleted, update]
  );

  // Formato en bloques: tocar de nuevo la misma respuesta la borra.
  function answerInBlock(questionOrder: number, answer: AnswerValue) {
    const current = sessionRef.current;
    if (!current) return;
    if (current.answers[String(questionOrder)] === answer) {
      update(clearAnswer(current, questionOrder));
      return;
    }
    update(setAnswer(current, questionOrder, answer));
  }

  function goToBlock(nextBlock: number) {
    const current = sessionRef.current;
    if (!current) return;
    const bounded = Math.max(0, Math.min(nextBlock, blocks.length - 1));
    update(setCurrentBlock(current, bounded));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextBlock() {
    const current = sessionRef.current;
    if (!current) return;
    const blockIndex = Math.min(current.currentBlock, blocks.length - 1);
    if (blockIndex === blocks.length - 1) {
      showNameStep();
      return;
    }
    trackBlockCompleted(blockIndex + 1);
    goToBlock(blockIndex + 1);
  }

  async function finishTest(choice: { nickname: string; isPublic: boolean }) {
    const current = sessionRef.current;
    if (!current || finishing) return;
    setFinishing(true);

    const nickname = choice.nickname.trim().slice(0, RANKING_NICKNAME_MAX_LENGTH);
    const alreadyCompleted = Boolean(current.completedAt);
    const completed = completeSession(current, { nickname, isPublic: choice.isPublic });
    const score = calculateScore(test, completed.answers);
    const result = getResultRange(test, score);
    saveLastNameChoice({ nickname, isPublic: choice.isPublic });

    if (!alreadyCompleted) {
      recordAnonymousAnswers(test, completed.answers);
      trackEvent("test_completed", {
        testSlug: test.slug,
        sessionId: completed.sessionId,
        score,
        fromShare: completed.fromShare,
        origin: completed.origin,
        format
      });
    }

    if (completed.isPublic) {
      const leaderboardEntry = {
        sessionId: completed.sessionId,
        testSlug: completed.testSlug,
        nickname: cleanShareNickname(nickname, RANKING_NICKNAME_MAX_LENGTH),
        score,
        groupTitle: result.title,
        completedAt: completed.completedAt ?? new Date().toISOString()
      };

      addLeaderboardEntry(leaderboardEntry);
      await addRemoteLeaderboardEntry(leaderboardEntry);
    }

    router.push(`/results/${completed.sessionId}`);
  }

  if (!session) {
    return (
      <GameScreen testSlug={test.slug}>
        <GameTopBar center={test.title} exitHref={exitHref} />
        <p className="flex flex-1 items-center justify-center font-black uppercase">Cargando test...</p>
      </GameScreen>
    );
  }

  const total = test.questions.length;
  const answered = getAnsweredCount(test, session.answers);

  if (stage === "name") {
    return (
      <GameScreen testSlug={test.slug}>
        <GameTopBar center={test.title} exitHref={exitHref} right={`${total} / ${total}`} />
        <div className="mx-auto w-full max-w-xl px-4">
          <GameProgress label="Avance del test" value={1} />
        </div>
        <NameStep
          busy={finishing}
          initialNickname={nameDefaults.nickname}
          initialPublic={nameDefaults.isPublic}
          onBack={() => setStage("questions")}
          onSubmit={finishTest}
          testTitle={test.title}
        />
      </GameScreen>
    );
  }

  if (format === "una") {
    const index = Math.min(session.currentQuestion ?? 0, total - 1);
    return (
      <GameScreen testSlug={test.slug}>
        <GameTopBar center={test.title} exitHref={exitHref} right={`${index + 1} / ${total}`} />
        <div className="mx-auto w-full max-w-xl px-4">
          <GameProgress label="Avance del test" value={answered / total} />
        </div>
        <OneByOne
          answers={session.answers}
          index={index}
          onAnswer={answerOne}
          onIndexChange={changeIndex}
          test={test}
        />
      </GameScreen>
    );
  }

  const blockIndex = Math.min(session.currentBlock, blocks.length - 1);
  const blockQuestions = blocks[blockIndex] ?? [];
  const answeredInBlock = blockQuestions.filter((question) => session.answers[String(question.displayOrder)]).length;

  return (
    <GameScreen testSlug={test.slug}>
      <div className="sticky top-0 z-10 bg-test pb-3">
        <GameTopBar
          center={test.title}
          exitHref={exitHref}
          right={`${answeredInBlock} de ${blockQuestions.length}`}
        />
        <div className="mx-auto w-full max-w-xl px-4">
          <p className="mb-1.5 text-xs font-black uppercase tracking-[0.05em]">
            Bloque {blockIndex + 1} de {blocks.length}
          </p>
          <GameProgress label="Avance del bloque" value={answeredInBlock / Math.max(1, blockQuestions.length)} />
        </div>
      </div>
      <BlockQuestions
        answers={session.answers}
        blockCount={blocks.length}
        blockIndex={blockIndex}
        key={blockIndex}
        onAnswer={answerInBlock}
        onNext={nextBlock}
        onPrevious={() => goToBlock(blockIndex - 1)}
        questions={blockQuestions}
      />
    </GameScreen>
  );
}
