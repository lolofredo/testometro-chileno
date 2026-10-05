"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GameScreen, GameTopBar } from "@/components/game/GameChrome";
import { arrivedFromShare, trackEvent } from "@/lib/analytics/events";
import { captureVisitOrigin, getVisitOrigin } from "@/lib/analytics/origin";
import { chooseQuestionFormat } from "@/lib/tests/question-format";
import { createStoredSession, getActiveSessionId, getStoredSession } from "@/lib/tests/storage";

type Resume = { sessionId: string; position: number };

// /tests/<test>/start: crea el test y pasa directo a las preguntas (el
// nombre se pide al final). Si hay uno a medias, pregunta si seguirlo.
export function TestStarter({
  slug,
  title,
  questionCount
}: {
  slug: string;
  title: string;
  questionCount: number;
}) {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const started = useRef(false);

  function playHref(sessionId: string) {
    return `/tests/${slug}/play?session=${sessionId}`;
  }

  function startNew() {
    if (started.current) return;
    started.current = true;
    const fromShare = arrivedFromShare();
    // Si el sitio se abrió directo en esta página, el origen aún no se anotó
    // (VisitOriginTracker corre después).
    captureVisitOrigin(window.location.href, document.referrer);
    const origin = getVisitOrigin();
    const format = chooseQuestionFormat({ slug });
    const session = createStoredSession({ testSlug: slug, fromShare, origin, format });
    trackEvent("test_started", {
      testSlug: slug,
      sessionId: session.sessionId,
      fromShare,
      origin,
      format
    });
    router.replace(playHref(session.sessionId));
  }

  useEffect(() => {
    const activeId = getActiveSessionId(slug);
    const active = activeId ? getStoredSession(activeId) : null;
    const answered = active ? Object.keys(active.answers).length : 0;
    if (active && !active.completedAt && answered > 0) {
      setResume({ sessionId: active.sessionId, position: Math.min(answered + 1, questionCount) });
      return;
    }
    startNew();
    // Solo al abrir la página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GameScreen testSlug={slug}>
      <GameTopBar center={title} exitHref={`/tests/${slug}`} />
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center p-4">
        {resume ? (
          <div className="grid gap-3.5 rounded-[18px] bg-paper p-5 text-ink">
            <p className="text-[11px] font-black uppercase tracking-[0.09em] text-test-text">
              Sigue donde quedaste
            </p>
            <p className="display text-[26px]">
              {title} · vas en la {resume.position} de {questionCount}
            </p>
            <button
              className="focus-ring min-h-[54px] rounded-xl bg-ink text-[15px] font-black uppercase tracking-[0.03em] text-paper"
              onClick={() => router.push(playHref(resume.sessionId))}
              type="button"
            >
              Seguir
            </button>
            <button
              className="focus-ring min-h-[50px] rounded-xl border-2 border-ink text-[13px] font-black uppercase tracking-[0.03em]"
              onClick={startNew}
              type="button"
            >
              Empezar de nuevo
            </button>
          </div>
        ) : (
          <p className="text-center font-black uppercase">Cargando test...</p>
        )}
      </div>
    </GameScreen>
  );
}
