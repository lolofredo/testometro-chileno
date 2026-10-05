import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Trophy } from "lucide-react";
import { Gauge } from "@/components/brand/Gauge";
import { getTestBySlug } from "@/data/tests";
import { getTestHeadline } from "@/lib/share/share-copy";
import { howItWorks } from "@/lib/tests/cards";
import { testThemeStyle } from "@/lib/tests/theme";
import { getDurationLabel } from "@/lib/tests/duration";
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
          <div className="rounded-2xl bg-white p-5 sm:p-8">
            <p className="mb-3 text-xs font-black uppercase text-tomato">
              {catalogTest.label}
            </p>
            <h1 className="display mb-5 text-4xl sm:text-7xl">
              {catalogTest.title}
            </h1>
            <p className="mb-6 max-w-3xl text-lg font-bold leading-relaxed text-ink/80">
              {catalogTest.description}
            </p>

            <div className="mb-6 rounded-xl bg-canvas p-4">
              <p className="text-sm font-black uppercase text-tomato">
                En desarrollo
              </p>
              <p className="mt-2 font-semibold leading-relaxed text-ink/80">
                Esta página ya existe para que la arquitectura del Testómetro
                pueda crecer ordenada. Las preguntas, resultados y ranking se
                activarán cuando publiquemos el test completo.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-black uppercase text-paper"
                href="/tests"
              >
                Ver catálogo
              </Link>
              <Link
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-mustard px-5 py-3 text-sm font-black uppercase"
                href={catalogTest.rankingHref ?? "/rankings"}
              >
                <Trophy size={18} strokeWidth={3} />
                Ver ranking futuro
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded-2xl bg-mustard p-5">
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

  const theme = testThemeStyle(test.slug);

  return (
    <div style={theme}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getTestJsonLd(test))
        }}
      />
      <section className="bg-test text-test-on">
        <div className="mx-auto grid max-w-3xl justify-items-center gap-3 px-4 pb-6 pt-5 text-center sm:pb-10 sm:pt-8">
          <Gauge className="h-auto w-[210px] sm:w-[260px]" size={260} sweep value={0.8} />
          <h1>
            <span className="block text-[11px] font-black uppercase tracking-[0.09em] sm:text-xs">
              {test.title}
            </span>
            <span className="display mt-2 block text-[36px] sm:text-6xl">
              {getTestHeadline(test.slug, test.title)}
            </span>
          </h1>
          <p className="text-sm font-bold">
            {test.questions.length} preguntas de sí o no · {getDurationLabel(test)}
          </p>
          <Link
            className="focus-ring mt-1 flex min-h-[54px] w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-paper px-6 text-[15px] font-black uppercase tracking-[0.03em] text-ink shadow-lift transition hover:-translate-y-0.5"
            href={`/tests/${test.slug}/start`}
          >
            Empezar
            <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-3xl gap-6 px-4 py-6 sm:py-10">
        <p className="text-base font-semibold leading-relaxed text-ink/80 sm:text-lg">{test.description}</p>

        <ol className="grid gap-2.5">
          {howItWorks.map((step, index) => (
            <li className="flex items-start gap-2.5 font-bold" key={step}>
              <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-ink font-display text-[13px] text-paper">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <Link
          className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 text-[13px] font-black uppercase underline decoration-2 underline-offset-4"
          href={`/rankings#ranking-${test.slug}`}
        >
          <Trophy aria-hidden="true" size={16} strokeWidth={2.6} />
          Ver ranking
        </Link>

        <section className="border-t border-ink/15 pt-4 text-[13px] leading-relaxed text-muted">
          <h2 className="mb-1 text-[11px] font-black uppercase tracking-[0.09em]">Contexto editorial</h2>
          <p>{test.disclaimer}</p>
          <p className="mt-2">
            {test.questions.length} preguntas · Sí / No · {getDurationLabel(test)} aprox. · Versión {test.version}
          </p>
        </section>
      </div>
    </div>
  );
}
