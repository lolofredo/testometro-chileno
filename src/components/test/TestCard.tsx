import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import type { TestDefinition } from "@/lib/tests/types";

export function TestCard({ test }: { test: TestDefinition }) {
  return (
    <article className="border-4 border-ink bg-paper p-5 shadow-[8px_8px_0_#17120f]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-normal text-tomato">
            {test.eyebrow}
          </p>
          <h2 className="text-2xl font-black uppercase leading-none">
            {test.title}
          </h2>
        </div>
        <span className="grid size-12 shrink-0 place-items-center border-4 border-ink bg-mustard">
          <ClipboardList size={24} strokeWidth={3} />
        </span>
      </div>

      <p className="mb-5 text-base font-semibold leading-relaxed text-ink/80">
        {test.subtitle}
      </p>

      <div className="mb-5 grid grid-cols-3 border-4 border-ink text-center text-sm font-black uppercase">
        <span className="border-r-4 border-ink bg-white px-2 py-3">
          {test.questions.length} preguntas
        </span>
        <span className="border-r-4 border-ink bg-white px-2 py-3">Si / No</span>
        <span className="bg-white px-2 py-3">Ranking</span>
      </div>

      <Link
        className="focus-ring inline-flex w-full items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-3 text-center text-sm font-black uppercase text-paper shadow-[5px_5px_0_#17120f] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#17120f]"
        href={`/tests/${test.slug}`}
      >
        Entrar al test
        <ArrowRight size={18} strokeWidth={3} />
      </Link>
    </article>
  );
}
