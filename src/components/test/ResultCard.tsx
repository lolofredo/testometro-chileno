import type { ResultRange } from "@/lib/tests/types";

export function ResultCard({
  nickname,
  score,
  result
}: {
  nickname: string;
  score: number;
  result: ResultRange;
}) {
  return (
    <section className="paper-noise overflow-hidden border-4 border-ink bg-paper shadow-[10px_10px_0_#17120f]">
      <div className="relative border-b-4 border-ink bg-tomato px-5 py-3 text-paper">
        <p className="text-center text-sm font-black uppercase tracking-normal">
          Ultimo minuto
        </p>
      </div>
      <div className="relative p-5 sm:p-8">
        <p className="mb-2 text-xs font-black uppercase text-tomato">
          Instrumento patrimonial de internet chileno
        </p>
        <h1 className="headline-shadow mb-5 text-4xl font-black uppercase leading-none sm:text-6xl">
          {nickname} cayó en el Rotómetro
        </h1>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-sm font-black uppercase text-ink/60">Resultado</p>
            <p className="text-3xl font-black uppercase leading-none text-bluepop sm:text-5xl">
              {result.title}
            </p>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-relaxed text-ink/80">
              {result.description}
            </p>
          </div>

          <div className="border-4 border-ink bg-white p-4 text-center">
            <p className="text-xs font-black uppercase text-ink/60">Puntaje</p>
            <p className="text-5xl font-black leading-none">{score}</p>
            <p className="text-sm font-black uppercase">{result.shortLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
