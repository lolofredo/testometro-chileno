import type { Metadata } from "next";
import Link from "next/link";
import { ShareCtaLink, TrackSharedOpen } from "@/components/share/SharedResultTracking";
import { ArrowRight } from "lucide-react";
import { ResultCard } from "@/components/test/ResultCard";
import { tests } from "@/data/tests";
import { getSharedResult } from "@/lib/share/result-link";
import { getInvitation } from "@/lib/share/share-copy";
import { absoluteUrl, siteConfig } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string; token: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, token } = await params;
  const shared = getSharedResult(slug, token);
  const robots = { index: false, follow: false };

  if (!shared) {
    return { title: "Resultado no encontrado", robots, alternates: { canonical: null } };
  }

  const { test, score, nickname, result } = shared;
  const invitation = getInvitation(test.slug, test.title);
  const title = `${nickname}: ${result.title} en el ${test.title}`;
  const description = `${score} puntos. ${invitation.question} Haz el test en ${siteConfig.name}.`;
  const path = `/r/${test.slug}/${token}`;
  const image = {
    url: absoluteUrl(`${path}/og`),
    width: 1200,
    height: 630,
    alt: `Resultado de ${nickname} en el ${test.title}: ${result.title}`
  };

  return {
    title,
    description,
    robots,
    // Canónica sin parámetros utm (los links compartidos los traen). Sin
    // esto la página heredaría la canónica de la home.
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url]
    }
  };
}

export default async function SharedResultPage({ params }: PageProps) {
  const { slug, token } = await params;
  const shared = getSharedResult(slug, token);

  if (!shared) {
    return (
      <div className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl border-4 border-ink bg-paper p-6 text-center shadow-[8px_8px_0_#17120f]">
          <p className="mb-4 text-xl font-black uppercase">
            Este resultado no existe o el link está incompleto
          </p>
          <Link
            className="focus-ring inline-flex border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper"
            href="/tests"
          >
            Ver tests
          </Link>
        </div>
      </div>
    );
  }

  const { test, score, nickname, result } = shared;
  const invitation = getInvitation(test.slug, test.title);
  const otherTests = tests.filter((item) => item.slug !== test.slug);

  return (
    <div className="px-4 pt-8 sm:px-6 sm:py-12">
      <TrackSharedOpen testSlug={test.slug} />

      <div className="mx-auto max-w-5xl">
        <ResultCard nickname={nickname} testTitle={test.title} score={score} result={result} />

        <section className="mt-8 border-4 border-ink bg-mustard p-5 text-center shadow-[8px_8px_0_#17120f] sm:p-8">
          <p className="mb-4 text-3xl font-black uppercase leading-none sm:text-5xl">
            {invitation.question}
          </p>
          <p className="mx-auto mb-6 max-w-xl font-semibold leading-relaxed text-ink/80">
            {test.questions.length} preguntas de sí o no. Gratis y sin registrarte.
          </p>
          <ShareCtaLink
            sharedTestSlug={test.slug}
            className="focus-ring inline-flex w-full items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-4 text-base font-black uppercase text-paper shadow-[5px_5px_0_#17120f] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#17120f] sm:w-auto sm:px-10"
            href={`/tests/${test.slug}`}
          >
            {invitation.cta}
            <ArrowRight size={20} strokeWidth={3} />
          </ShareCtaLink>
        </section>

        {otherTests.length > 0 ? (
          <section className="mt-8">
            <p className="mb-3 text-sm font-black uppercase text-ink/60">Otros tests</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {otherTests.map((item) => (
                <ShareCtaLink
                  sharedTestSlug={test.slug}
                  key={item.slug}
                  className="focus-ring flex items-center justify-between gap-3 border-4 border-ink bg-white px-5 py-4 font-black uppercase"
                  href={`/tests/${item.slug}`}
                >
                  {item.title}
                  <ArrowRight size={18} strokeWidth={3} />
                </ShareCtaLink>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t-4 border-ink bg-mustard p-3 sm:hidden">
        <ShareCtaLink
          sharedTestSlug={test.slug}
          className="focus-ring flex w-full items-center justify-center gap-2 border-4 border-ink bg-tomato px-4 py-3 text-sm font-black uppercase text-paper"
          href={`/tests/${test.slug}`}
        >
          {invitation.question}
          <ArrowRight size={18} strokeWidth={3} />
        </ShareCtaLink>
      </div>
    </div>
  );
}
