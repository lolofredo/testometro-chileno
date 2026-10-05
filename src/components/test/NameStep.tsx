"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { RANKING_NICKNAME_MAX_LENGTH } from "@/lib/share/nickname";

// Pantalla final, antes del resultado: con qué nombre sale y si va al
// ranking. Opcional; viene con el último nombre usado en este celular.
export function NameStep({
  testTitle,
  initialNickname,
  initialPublic,
  busy,
  onBack,
  onSubmit
}: {
  testTitle: string;
  initialNickname: string;
  initialPublic: boolean;
  busy: boolean;
  onBack: () => void;
  onSubmit: (choice: { nickname: string; isPublic: boolean }) => void;
}) {
  const [nickname, setNickname] = useState(initialNickname);
  const [isPublic, setIsPublic] = useState(initialPublic);

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ nickname, isPublic });
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-3 px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
      <form className="grid gap-3.5 rounded-[18px] bg-paper p-5 text-ink" onSubmit={submit}>
        <p className="text-[11px] font-black uppercase tracking-[0.09em] text-test-text">
          ¡Listo! Tu resultado ya está
        </p>
        <h1 className="display text-[23px] leading-[1.02] sm:text-3xl">¿Con qué nombre sale tu resultado?</h1>

        <label className="block" htmlFor="nickname">
          <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.05em]">Nickname</span>
          <input
            autoComplete="nickname"
            className="focus-ring h-[54px] w-full rounded-xl border-2 border-ink bg-white px-3.5 text-lg font-bold"
            id="nickname"
            maxLength={RANKING_NICKNAME_MAX_LENGTH}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Ej: Juanito"
            value={nickname}
          />
        </label>

        <label className="flex cursor-pointer items-start gap-2.5" htmlFor="ranking">
          <input
            checked={isPublic}
            className="mt-0.5 size-6 shrink-0 accent-[#17120f]"
            id="ranking"
            onChange={(event) => setIsPublic(event.target.checked)}
            type="checkbox"
          />
          <span>
            <span className="block text-sm font-bold">Aparecer en el ranking del {testTitle}</span>
            <span className="block text-xs font-semibold text-muted">
              Si lo activas, se mostrará tu nickname, puntaje, grupo y fecha.
            </span>
          </span>
        </label>

        <button
          className="focus-ring flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-test text-[15px] font-black uppercase tracking-[0.03em] text-test-on shadow-lift disabled:opacity-60"
          disabled={busy}
          type="submit"
        >
          Ver mi resultado
          <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
        </button>

        <p className="text-xs leading-snug text-muted">
          Puedes dejarlo en blanco. Tus respuestas se guardan de forma anónima, sin tu nickname, para
          estadísticas que solo se publican como totales.
        </p>
      </form>

      <button
        className="focus-ring -ml-2 inline-flex min-h-11 w-fit items-center gap-0.5 rounded-lg pl-1 pr-2 text-[13px] font-black uppercase tracking-[0.03em]"
        onClick={onBack}
        type="button"
      >
        <ChevronLeft aria-hidden="true" size={18} strokeWidth={2.8} />
        Anterior
      </button>
    </div>
  );
}
