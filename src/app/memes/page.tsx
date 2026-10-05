import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { memeSections, memes } from "@/data/memes";
import { absoluteUrl, siteConfig, siteOgImage } from "@/lib/seo";
import { tests } from "@/data/tests";
import { getInvitation } from "@/lib/share/share-copy";
import { getDurationLabel } from "@/lib/tests/duration";
import { getFeaturedTest } from "@/lib/tests/featured";
import { testThemeStyle } from "@/lib/tests/theme";
import type { TestDefinition } from "@/lib/tests/types";

export const metadata: Metadata = {
  title: "Memes chilenos | Humor chileno y cultura popular chilena",
  description:
    "Galería de memes chilenos, humor chileno, cultura popular chilena, chilenidad, nostalgia e internet chileno actual.",
  keywords: [
    ...siteConfig.keywords,
    "memes chilenos",
    "humor chileno",
    "memes de Chile",
    "cultura popular chilena",
    "chilenidad"
  ],
  alternates: {
    canonical: absoluteUrl("/memes")
  },
  openGraph: {
    title: "Memes chilenos | Testómetro Chileno",
    description:
      "Memes chilenos de cultura popular, humor chileno, nostalgia y rarezas del Chile actual.",
    url: absoluteUrl("/memes"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [siteOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: "Memes chilenos | Testómetro Chileno",
    description:
      "Galería de memes chilenos, humor chileno y cultura popular chilena.",
    images: [siteOgImage.url]
  }
};

const memesPerTestCard = 3;

// Tests para las tarjetas entre memes: el destacado primero, el Original al final.
const cardTests: TestDefinition[] = (() => {
  const featured = getFeaturedTest();
  const others = tests
    .filter((test) => test.slug !== featured.slug)
    .sort((a, b) => a.questions.length - b.questions.length);
  return [featured, ...others];
})();

function MemeTestCard({ test }: { test: TestDefinition }) {
  const invitation = getInvitation(test.slug, test.title);

  return (
    <article
      className="flex flex-col justify-between gap-6 rounded-2xl bg-test p-6 text-test-on"
      style={testThemeStyle(test.slug)}
    >
      <div>
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.09em]">¿Te reíste?</p>
        <p className="display text-3xl sm:text-4xl">{invitation.question}</p>
        <p className="mt-3 text-sm font-bold">
          {test.title} · {test.questions.length} preguntas · {getDurationLabel(test)}
        </p>
      </div>
      <Link
        className="focus-ring inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-paper px-5 text-sm font-black uppercase text-ink shadow-lift"
        href={`/tests/${test.slug}`}
      >
        {invitation.cta}
        <ArrowRight size={18} strokeWidth={3} />
      </Link>
    </article>
  );
}

export default function MemesPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-[11px] font-black uppercase tracking-[0.09em] text-tomato">Archivo visual</p>
          <h1 className="display mt-1 text-[40px] sm:text-6xl">Memes</h1>
          <p className="mt-3 max-w-3xl text-base font-semibold leading-relaxed text-ink/80 sm:text-lg">
            Un muro de cultura popular chilena para mirar, compartir y reírse
            con esa mezcla precisa de nostalgia, talla interna y memoria de
            internet.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {memeSections.map((section) => (
            <article className="rounded-2xl bg-white p-5" key={section.title}>
              <Sparkles
                className="mb-3 text-tomato"
                size={22}
                strokeWidth={2.6}
              />
              <h2 className="display mb-3 text-2xl">
                {section.title}
              </h2>
              <p className="text-sm font-bold leading-relaxed text-ink/75">
                {section.description}
              </p>
            </article>
          ))}
        </div>

        {memes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-ink/40 bg-white p-8 text-center">
            <p className="mb-3 text-xs font-black uppercase text-tomato">
              Primera tanda en preparación
            </p>
            <h2 className="mx-auto max-w-3xl text-3xl font-black uppercase leading-none sm:text-4xl">
              Aquí vivirá la galería de memes del Testómetro
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-relaxed text-ink/75">
              La estructura ya está lista para publicar memes por colecciones,
              tags y fechas, manteniendo el estilo de archivo pop chileno.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {memes.map((meme, index) => [
              <article className="overflow-hidden rounded-2xl bg-white" key={meme.slug}>
                <Image
                  alt={meme.alt}
                  className="aspect-square w-full bg-white object-contain"
                  height={900}
                  src={meme.imageSrc}
                  width={900}
                />
              </article>,
              // Una invitación a un test cada 3 memes.
              (index + 1) % memesPerTestCard === 0 ? (
                <MemeTestCard
                  key={`test-${meme.slug}`}
                  test={cardTests[Math.floor(index / memesPerTestCard) % cardTests.length]}
                />
              ) : null
            ])}
          </div>
        )}
      </section>
    </div>
  );
}
