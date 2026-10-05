import type { Metadata } from "next";
import { RankingTabs } from "@/components/ranking/RankingTabs";
import { RankingView } from "@/components/test/RankingView";
import { getTestBySlug } from "@/data/tests";
import { catalogTests } from "@/data/test-catalog";
import { absoluteUrl, siteConfig, siteOgImage } from "@/lib/seo";
import { getOrderedTestCards } from "@/lib/tests/cards";

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
  // Mismo orden que la home: el destacado primero, el Original al final.
  const order = getOrderedTestCards().map((card) => card.slug);
  const ordered = [...catalogTests].sort((a, b) => {
    const indexA = order.indexOf(a.slug);
    const indexB = order.indexOf(b.slug);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  const tabs = ordered.map((catalogTest) => {
    const playableTest = getTestBySlug(catalogTest.slug);

    return {
      slug: catalogTest.slug,
      title: catalogTest.title,
      panel: playableTest ? (
        <RankingView
          description={catalogTest.rankingDescription}
          headingLevel="h2"
          test={playableTest}
          title={`Ranking ${catalogTest.title}`}
        />
      ) : (
        <section className="rounded-2xl border-2 border-dashed border-ink/40 bg-white p-6 text-center">
          <p className="mb-2 text-xs font-black uppercase text-tomato">Ranking futuro</p>
          <h2 className="display text-4xl">{catalogTest.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl font-bold leading-relaxed text-ink/75">
            {catalogTest.rankingDescription}
          </p>
        </section>
      )
    };
  });

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-4xl">
        <div className="mb-4">
          <p className="text-[11px] font-black uppercase tracking-[0.09em] text-tomato">Marcadores públicos</p>
          <h1 className="display mt-1 text-[40px] sm:text-6xl">Rankings</h1>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-relaxed text-ink/75">
            El salón de la fama del Testómetro Chileno. Elige un test para ver su ranking público.
          </p>
        </div>
        <RankingTabs tabs={tabs} />
      </section>
    </div>
  );
}
