import type { Metadata } from "next";
import Link from "next/link";
import { TestRows } from "@/components/home/TestCollection";
import { catalogTests } from "@/data/test-catalog";
import { getOrderedTestCards } from "@/lib/tests/cards";
import { absoluteUrl, siteConfig, siteOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tests chilenos | Rotómetro, Cuicómetro, Chantómetro y cultura popular chilena",
  description:
    "Catálogo de tests chilenos de humor y cultura popular chilena: Rotómetro Original, Rotómetro 2.0, Cuicómetro, Chantómetro y futuros tests del Testómetro Chileno.",
  keywords: [
    ...siteConfig.keywords,
    "tests chilenos",
    "test chileno",
    "qué tan roto eres",
    "qué tan cuico eres"
  ],
  alternates: {
    canonical: absoluteUrl("/tests")
  },
  openGraph: {
    title: "Tests chilenos | Testómetro Chileno",
    description:
      "Tests de cultura popular chilena, humor chileno, Rotómetro, Cuicómetro y Chantómetro.",
    url: absoluteUrl("/tests"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [siteOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tests chilenos | Testómetro Chileno",
    description:
      "Catálogo de tests chilenos de humor y cultura popular chilena.",
    images: [siteOgImage.url]
  }
};

function ComingSoonCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      className="focus-ring block rounded-2xl border-2 border-dashed border-ink/40 bg-white p-5 transition hover:-translate-y-0.5"
      href={href}
    >
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.09em] text-muted">Próximamente</p>
      <h2 className="display mb-3 text-2xl">{title}</h2>
      <p className="text-base font-semibold leading-relaxed text-ink/70">{description}</p>
    </Link>
  );
}

export default function TestsPage() {
  const futureTests = catalogTests.filter((test) => test.status === "coming-soon");

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-5">
          <p className="text-[11px] font-black uppercase tracking-[0.09em] text-tomato">Catálogo</p>
          <h1 className="display mt-1 text-[30px] sm:text-5xl">Tests disponibles</h1>
        </div>
        <TestRows cards={getOrderedTestCards()} />
        {futureTests.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {futureTests.map((test) => (
              <ComingSoonCard
                description={test.description}
                href={test.href ?? `/tests/${test.slug}`}
                key={test.slug}
                title={test.title}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
