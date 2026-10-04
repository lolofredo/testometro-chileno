"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { TestDefinition } from "@/lib/tests/types";
import { arrivedFromShare, trackEvent } from "@/lib/analytics/events";
import {
  createStoredSession,
  getActiveSessionId,
  getStoredSession,
  setActiveSessionId
} from "@/lib/tests/storage";

export function StartForm({ test }: { test: TestDefinition }) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);

  useEffect(() => {
    const activeId = getActiveSessionId(test.slug);
    if (activeId && getStoredSession(activeId)) {
      setExistingSessionId(activeId);
    }
  }, [test.slug]);

  function startTest() {
    const cleanNickname = nickname.trim().slice(0, 32) || "Anonimo";
    const fromShare = arrivedFromShare();
    const session = createStoredSession({
      testSlug: test.slug,
      nickname: cleanNickname,
      isPublic,
      fromShare
    });
    trackEvent("test_started", {
      testSlug: test.slug,
      sessionId: session.sessionId,
      fromShare
    });

    router.push(`/tests/${test.slug}/play?session=${session.sessionId}`);
  }

  function continueSession() {
    if (!existingSessionId) return;
    setActiveSessionId(test.slug, existingSessionId);
    router.push(`/tests/${test.slug}/play?session=${existingSessionId}`);
  }

  return (
    <div className="mx-auto max-w-2xl border-4 border-ink bg-paper p-5 shadow-[8px_8px_0_#17120f] sm:p-7">
      <div className="mb-6">
        <p className="mb-2 text-xs font-black uppercase text-tomato">
          Antes de empezar
        </p>
        <h1 className="text-3xl font-black uppercase leading-none sm:text-5xl">
          Identificate para el marcador
        </h1>
      </div>

      {existingSessionId ? (
        <button
          className="focus-ring mb-5 inline-flex w-full items-center justify-center gap-2 border-4 border-ink bg-mustard px-5 py-3 text-sm font-black uppercase shadow-[5px_5px_0_#17120f]"
          type="button"
          onClick={continueSession}
        >
          <RotateCcw size={18} strokeWidth={3} />
          Continuar avance guardado
        </button>
      ) : null}

      <label className="mb-5 block">
        <span className="mb-2 block text-sm font-black uppercase">Nickname</span>
        <input
          className="focus-ring w-full border-4 border-ink bg-white px-4 py-3 text-lg font-bold"
          maxLength={32}
          placeholder="Ej: Juanito"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
      </label>

      <label className="mb-6 flex cursor-pointer items-start gap-3 border-4 border-ink bg-white p-4">
        <input
          className="mt-1 size-5 accent-[#2bbf8a]"
          type="checkbox"
          checked={isPublic}
          onChange={(event) => setIsPublic(event.target.checked)}
        />
        <span>
          <span className="block text-sm font-black uppercase">
            Aparecer en ranking publico
          </span>
          <span className="block text-sm font-semibold text-ink/70">
            Si lo activas, se mostrara tu nickname, puntaje, grupo y fecha.
          </span>
        </span>
      </label>

      <button
        className="focus-ring inline-flex w-full items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-4 text-sm font-black uppercase text-paper shadow-[5px_5px_0_#17120f] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#17120f]"
        type="button"
        onClick={startTest}
      >
        Empezar test
        <ArrowRight size={18} strokeWidth={3} />
      </button>
    </div>
  );
}
