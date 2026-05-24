import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Trophy } from "lucide-react";
import { getTestBySlug } from "@/data/tests";
import { getCatalogTestBySlug } from "@/data/test-catalog";
import {
  getCatalogTestMetadata,
  getTestJsonLd,
  getTestMetadata
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = getTestBySlug(slug);
  const catalogTest = getCatalogTestBySlug(slug);

  if (test) return getTestMetadata(test);
  if (catalogTest) return getCatalogTestMetadata(catalogTest);

  return {};
}

export default async function TestDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const test = getTestBySlug(slug);
  const catalogTest = getCatalogTestBySlug(slug);

  if (!catalogTest) notFound();

  if (!test) {
    return (
      <div className="px-4 py-8 sm:px-6 sm:py-12">
        <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_360px]">
          <div className="border-4 border-ink bg-paper p-5 shadow-[8px_8px_0_#17120f] sm:p-8">
            <p className="mb-3 text-xs font-black uppercase text-tomato">
              {catalogTest.label}
            </p>
            <h1 className="headline-shadow mb-5 text-4xl font-black uppercase leading-none sm:text-7xl">
              {catalogTest.title}
            </h1>
            <p className="mb-6 max-w-3xl text-lg font-bold leading-relaxed text-ink/80">
              {catalogTest.description}
            </p>

            <div className="mb-6 border-4 border-ink bg-white p-4">
              <p className="text-sm font-black uppercase text-tomato">
                En desarrollo
              </p>
              <p className="mt-2 font-semibold leading-relaxed text-ink/80">
                Esta pagina ya existe para que la arquitectura del Testómetro
                pueda crecer ordenada. Las preguntas, resultados y ranking se
                activaran cuando publiquemos el test completo.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-white px-5 py-3 text-sm font-black uppercase"
                href="/tests"
              >
                Ver catalogo
              </Link>
              <Link
                className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-mustard px-5 py-3 text-sm font-black uppercase"
                href={catalogTest.rankingHref ?? "/rankings"}
              >
                <Trophy size={18} strokeWidth={3} />
                Ver ranking futuro
              </Link>
            </div>
          </div>

          <aside className="h-fit border-4 border-ink bg-mustard p-5 shadow-[8px_8px_0_#17120f]">
            <Clock className="mb-4" size={30} strokeWidth={3} />
            <p className="mb-4 text-sm font-black uppercase">Ficha previa</p>
            <dl className="grid gap-3 text-sm font-bold">
              <div className="flex justify-between gap-4 border-b-2 border-ink/30 pb-2">
                <dt>Estado</dt>
                <dd>{catalogTest.label}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b-2 border-ink/30 pb-2">
                <dt>Tema</dt>
                <dd className="text-right">{catalogTest.theme}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Ranking</dt>
                <dd>Por activar</dd>
              </div>
            </dl>
          </aside>
        </section>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getTestJsonLd(test))
        }}
      />
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_360px]">
        <div className="border-4 border-ink bg-paper p-5 shadow-[8px_8px_0_#17120f] sm:p-8">
          <p className="mb-3 text-xs font-black uppercase text-tomato">
            {test.eyebrow}
          </p>
          <h1 className="headline-shadow mb-5 text-4xl font-black uppercase leading-none sm:text-7xl">
            {test.title}
          </h1>
          <p className="mb-6 max-w-3xl text-lg font-bold leading-relaxed text-ink/80">
            {test.description}
          </p>

          <div className="mb-6 border-4 border-ink bg-white p-4">
            <p className="text-sm font-black uppercase text-tomato">
              Contexto editorial
            </p>
            <p className="mt-2 font-semibold leading-relaxed text-ink/80">
              {test.disclaimer}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper shadow-[5px_5px_0_#17120f]"
              href={`/tests/${test.slug}/start`}
            >
              Empezar test
              <ArrowRight size={18} strokeWidth={3} />
            </Link>
            <Link
              className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-white px-5 py-3 text-sm font-black uppercase"
              href={`/rankings#ranking-${test.slug}`}
            >
              <Trophy size={18} strokeWidth={3} />
              Ver ranking
            </Link>
          </div>
        </div>

        <aside className="h-fit border-4 border-ink bg-mustard p-5 shadow-[8px_8px_0_#17120f]">
          <p className="mb-4 text-sm font-black uppercase">Ficha del test</p>
          <dl className="grid gap-3 text-sm font-bold">
            <div className="flex justify-between gap-4 border-b-2 border-ink/30 pb-2">
              <dt>Preguntas</dt>
              <dd>{test.questions.length}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b-2 border-ink/30 pb-2">
              <dt>Formato</dt>
              <dd>Sí / No</dd>
            </div>
            <div className="flex justify-between gap-4 border-b-2 border-ink/30 pb-2">
              <dt>Bloques</dt>
              <dd>10 preguntas</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Version</dt>
              <dd>{test.version}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </div>
  );
}
