import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GaugeDial } from "@/components/brand/GaugeDial";
import { SharedStickyCta, ShareCtaLink, TrackSharedOpen } from "@/components/share/SharedResultTracking";
import { tests } from "@/data/tests";
import { getSharedResult } from "@/lib/share/result-link";
import { getInvitation } from "@/lib/share/share-copy";
import { ANONYMOUS_NICKNAME } from "@/lib/share/nickname";
import { getScoreBounds } from "@/lib/tests/scoring";
import { testThemeStyle } from "@/lib/tests/theme";
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
      <div className="px-4 py-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="display mb-4 text-2xl">Este resultado no existe o el link está incompleto</p>
          <Link
            className="focus-ring inline-flex min-h-[52px] items-center rounded-xl bg-tomato px-6 text-sm font-black uppercase text-paper shadow-lift"
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
  const named = nickname !== ANONYMOUS_NICKNAME;
  const bounds = getScoreBounds(test);

  return (
    <div style={testThemeStyle(test.slug)}>
      <TrackSharedOpen testSlug={test.slug} />

      <div className="mx-auto grid max-w-xl gap-4 px-4 py-5 sm:py-10">
        <section className="rounded-[20px] bg-test p-[18px] text-center text-test-on">
          <p className="text-[11px] font-black uppercase tracking-[0.09em]">
            {named ? `${nickname} hizo el ${test.title}` : `Resultado del ${test.title}`}
          </p>
          <div className="mt-3">
            <GaugeDial size={190} sweep value={(score - bounds.min) / Math.max(1, bounds.max - bounds.min)} />
          </div>
          {named ? (
            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.09em]">y es oficialmente</p>
          ) : null}
          <h1 className="display mt-1.5 text-[30px] sm:text-4xl">{result.title}</h1>
          <p className="mt-3 inline-flex items-baseline rounded-full bg-paper px-3.5 py-1.5 font-display text-[22px] text-ink">
            {score}
            <span className="text-[13px]">/{bounds.max}</span>
          </p>
          <p className="mt-3 font-semibold">{result.description}</p>
        </section>

        <section className="grid gap-3 rounded-[18px] bg-white p-[18px] text-center" id="invitacion">
          <p className="display text-2xl sm:text-3xl">{invitation.question}</p>
          <ShareCtaLink
            sharedTestSlug={test.slug}
            className="focus-ring flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-test px-5 text-[15px] font-black uppercase text-test-on shadow-lift transition hover:-translate-y-0.5"
            href={`/tests/${test.slug}`}
          >
            {invitation.cta}
            <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
          </ShareCtaLink>
          <p className="text-[13px] font-bold text-muted">
            {test.questions.length} preguntas de sí o no. Gratis y sin registrarte.
          </p>
        </section>

        {otherTests.length > 0 ? (
          <section>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.05em] text-muted">Otros tests</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {otherTests.map((item) => (
                <ShareCtaLink
                  sharedTestSlug={test.slug}
                  key={item.slug}
                  className="focus-ring flex min-h-[52px] items-center justify-between gap-3 rounded-2xl bg-test px-4 py-3 text-sm font-black uppercase text-test-on"
                  href={`/tests/${item.slug}`}
                  style={testThemeStyle(item.slug)}
                >
                  {item.title}
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
                </ShareCtaLink>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <SharedStickyCta
        href={`/tests/${test.slug}`}
        label={invitation.cta}
        sharedTestSlug={test.slug}
        targetId="invitacion"
      />
    </div>
  );
}
