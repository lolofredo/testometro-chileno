import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getInvitation } from "@/lib/share/share-copy";
import { getFeaturedTest } from "@/lib/tests/featured";

export default function NotFound() {
  const featured = getFeaturedTest();
  const invitation = getInvitation(featured.slug, featured.title);

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-2xl border-4 border-ink bg-paper p-6 text-center shadow-[8px_8px_0_#17120f] sm:p-8">
        <p className="mb-2 text-xs font-black uppercase text-tomato">Error 404</p>
        <h1 className="headline-shadow text-4xl font-black uppercase leading-none sm:text-5xl">
          Esta página no existe
        </h1>
        <p className="mx-auto mt-4 max-w-md font-semibold leading-relaxed text-ink/80">
          Puede que el link esté mal copiado o que la página ya no exista. Mientras tanto:
        </p>

        <div className="mt-6 border-4 border-ink bg-mustard p-5">
          <p className="text-2xl font-black uppercase leading-none sm:text-3xl">
            {invitation.question.replace(/^¿Y tú /, "¿")}
          </p>
          <Link
            className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-4 text-sm font-black uppercase text-paper shadow-[5px_5px_0_#17120f] sm:w-auto"
            href={`/tests/${featured.slug}`}
          >
            {invitation.cta}
            <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>

        <Link
          className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 border-4 border-ink bg-white px-5 py-3 text-sm font-black uppercase sm:w-auto"
          href="/tests"
        >
          Ver todos los tests
        </Link>
      </section>
    </div>
  );
}
