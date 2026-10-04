import type { Metadata } from "next";
import Link from "next/link";
import { TestCard } from "@/components/test/TestCard";
import { tests } from "@/data/tests";
import { catalogTests } from "@/data/test-catalog";
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
      className="focus-ring block border-4 border-dashed border-ink bg-white p-5 opacity-80 transition hover:-translate-y-0.5 hover:bg-mustard"
      href={href}
    >
      <p className="mb-2 inline-flex border-2 border-ink bg-paper px-2 py-1 text-xs font-black uppercase">
        Próximamente
      </p>
      <h2 className="mb-3 text-2xl font-black uppercase leading-none">{title}</h2>
      <p className="text-base font-semibold leading-relaxed text-ink/70">
        {description}
      </p>
    </Link>
  );
}

export default function TestsPage() {
  const futureTests = catalogTests.filter((test) => test.status === "coming-soon");

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-black uppercase text-tomato">
            Catálogo
          </p>
          <h1 className="text-5xl font-black uppercase leading-none">
            Tests disponibles
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {tests.map((test) => (
            <TestCard key={test.slug} test={test} />
          ))}
          {futureTests.map((test) => (
            <ComingSoonCard
              description={test.description}
              href={test.href ?? `/tests/${test.slug}`}
              key={test.slug}
              title={test.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
