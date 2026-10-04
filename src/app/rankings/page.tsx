import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Trophy } from "lucide-react";
import { RankingView } from "@/components/test/RankingView";
import { getTestBySlug } from "@/data/tests";
import { catalogTests } from "@/data/test-catalog";
import { absoluteUrl, siteConfig, siteOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Rankings | Resultados públicos de tests chilenos",
  description:
    "Rankings públicos del Testómetro Chileno: resultados del Rotómetro Original, Rotómetro 2.0, Cuicómetro, Chantómetro y tests de cultura popular chilena.",
  keywords: [
    ...siteConfig.keywords,
    "ranking Rotómetro",
    "ranking Cuicómetro",
    "ranking Chantómetro",
    "resultados tests chilenos"
  ],
  alternates: {
    canonical: absoluteUrl("/rankings")
  },
  openGraph: {
    title: "Rankings | Testómetro Chileno",
    description:
      "Resultados públicos y rankings de tests chilenos de humor y cultura popular chilena.",
    url: absoluteUrl("/rankings"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [siteOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: "Rankings | Testómetro Chileno",
    description:
      "Rankings públicos del Rotómetro, Cuicómetro, Chantómetro y tests chilenos.",
    images: [siteOgImage.url]
  }
};

export default function RankingsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 border-4 border-ink bg-paper p-5 shadow-[8px_8px_0_#17120f] sm:p-8">
          <p className="mb-3 text-xs font-black uppercase text-tomato">
            Marcadores públicos
          </p>
          <h1 className="headline-shadow text-4xl font-black uppercase leading-none sm:text-7xl">
            Rankings
          </h1>
          <p className="mt-5 max-w-3xl text-lg font-bold leading-relaxed text-ink/80">
            El salón de la fama del Testómetro Chileno. Elige un test y baja
            directo a su ranking público, sin salir de esta página.
          </p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {catalogTests.map((test) => (
            <Link
              className="focus-ring block border-4 border-ink bg-white p-5 shadow-[6px_6px_0_#17120f] transition hover:-translate-y-0.5 hover:bg-mustard"
              href={`#ranking-${test.slug}`}
              key={test.slug}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="mb-2 inline-flex border-2 border-ink bg-paper px-2 py-1 text-[11px] font-black uppercase">
                    {test.label}
                  </p>
                  <h2 className="text-2xl font-black uppercase leading-none">
                    {test.title}
                  </h2>
                </div>
                <span className="grid size-10 shrink-0 place-items-center border-4 border-ink bg-tomato text-paper">
                  <Trophy size={18} strokeWidth={3} />
                </span>
              </div>
              <p className="text-sm font-bold leading-relaxed text-ink/75">
                {test.rankingDescription}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid gap-12">
          {catalogTests.map((catalogTest) => {
            const playableTest = getTestBySlug(catalogTest.slug);

            if (playableTest) {
              return (
                <div
                  className="scroll-mt-24"
                  id={`ranking-${catalogTest.slug}`}
                  key={catalogTest.slug}
                >
                  <RankingView
                    headingLevel="h2"
                    test={playableTest}
                    title={`Ranking ${catalogTest.title}`}
                  />
                </div>
              );
            }

            return (
              <section
                className="mx-auto w-full max-w-5xl scroll-mt-24 border-4 border-dashed border-ink bg-white p-6 text-center shadow-[8px_8px_0_#17120f]"
                id={`ranking-${catalogTest.slug}`}
                key={catalogTest.slug}
              >
                <Clock
                  className="mx-auto mb-4 text-tomato"
                  size={34}
                  strokeWidth={3}
                />
                <p className="mb-2 text-xs font-black uppercase text-tomato">
                  Ranking futuro
                </p>
                <h2 className="text-4xl font-black uppercase leading-none sm:text-5xl">
                  {catalogTest.title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl font-bold leading-relaxed text-ink/75">
                  {catalogTest.rankingDescription}
                </p>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
