import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Gauge } from "@/components/brand/Gauge";
import { FeaturedTest } from "@/components/home/FeaturedTest";
import { ResumeCard } from "@/components/home/ResumeCard";
import { CollectionCount, TestTiles } from "@/components/home/TestCollection";
import { getOrderedTestCards, howItWorks } from "@/lib/tests/cards";
import { memes } from "@/data/memes";
import { absoluteUrl, siteConfig, siteOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Testómetro Chileno | Tests chilenos, memes y humor chileno",
  description:
    "Plataforma de tests chilenos, memes chilenos, humor y cultura popular chilena: Rotómetro Original, Rotómetro 2.0, Cuicómetro, Chantómetro, Farandulómetro y nostalgia del Chile actual.",
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: "Testómetro Chileno",
    description:
      "Tests chilenos de humor, cultura popular chilena, memes, nostalgia, Rotómetro, Cuicómetro, Chantómetro y Farandulómetro.",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [siteOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: "Testómetro Chileno",
    description:
      "Tests chilenos, memes chilenos y cultura popular chilena para compartir.",
    images: [siteOgImage.url]
  }
};

export default function HomePage() {
  const cards = getOrderedTestCards();
  const featured = cards[0];
  const resumeTests = cards.map((card) => ({
    slug: card.slug,
    title: card.title,
    questionCount: card.questionCount
  }));
  const featuredMemes = memes.slice(0, 6);

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:pt-10">
      <section className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-center lg:gap-10">
        {/* Titular: "Testómetro Chileno" sigue siendo el h1 para Google; la
            pregunta es solo visual (no es título ni párrafo) y la frase de
            "tests chilenos" sigue siendo el primer párrafo. */}
        <div className="text-center lg:text-left">
          <Gauge
            className="mx-auto h-auto w-[208px] lg:mx-0 lg:w-[380px]"
            size={380}
            sweep
            ticks
            value={0.72}
          />
          <h1 className="mt-2 text-xs font-black uppercase tracking-[0.09em] text-muted lg:mt-4 lg:text-[13px]">
            Testómetro Chileno
          </h1>
          <div className="display mt-1.5 text-[34px] sm:text-5xl lg:text-[66px]">
            ¿Cuánto <span className="text-tomato">marcas</span> tú?
          </div>
          <p className="mx-auto mt-2 max-w-md text-[15px] font-semibold leading-snug text-muted lg:mx-0 lg:mt-4 lg:text-[19px]">
            Tests chilenos de humor. Sí o no, 3 minutos, sin registro.
          </p>
        </div>

        <div className="grid gap-3.5">
          <FeaturedTest card={featured} />
          <ResumeCard tests={resumeTests} />
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl lg:mt-12">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="display text-lg lg:text-2xl">Tu colección</h2>
          <CollectionCount cards={cards} />
        </div>
        <TestTiles cards={cards} featuredSlug={featured.slug} />
        <Link
          className="focus-ring mt-3 inline-flex min-h-11 items-center gap-2 text-[13px] font-black uppercase underline decoration-2 underline-offset-4"
          href="/tests"
        >
          Ver todos los tests
          <ArrowRight aria-hidden="true" size={16} strokeWidth={2.8} />
        </Link>

        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {howItWorks.map((step, index) => (
            <li className="border-t-[3px] border-ink pt-3" key={step}>
              <span className="display block text-[26px]">{index + 1}</span>
              <span className="text-base font-bold">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-12 max-w-6xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.09em] text-tomato">Memes del archivo</p>
            <h2 className="display mt-1 text-3xl sm:text-5xl">Cultura para compartir</h2>
          </div>
          <Link
            className="focus-ring inline-flex min-h-11 items-center gap-2 text-[13px] font-black uppercase underline decoration-2 underline-offset-4"
            href="/memes"
          >
            Ver memes
            <ArrowRight aria-hidden="true" size={16} strokeWidth={2.8} />
          </Link>
        </div>

        <Link aria-label="Ver la galería completa de memes" className="focus-ring block rounded-2xl" href="/memes">
          <div className="flex snap-x gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            {featuredMemes.map((meme) => (
              <Image
                alt={meme.alt}
                className="aspect-square w-[72%] shrink-0 snap-start rounded-2xl bg-white object-contain sm:w-[300px] lg:w-[31%]"
                height={900}
                key={meme.slug}
                src={meme.imageSrc}
                width={900}
              />
            ))}
          </div>
        </Link>
      </section>

      <section className="mx-auto mt-12 max-w-6xl">
        <h2 className="mb-2 text-sm font-black uppercase text-ink/60">Sobre el Testómetro</h2>
        <p className="max-w-3xl text-sm font-semibold leading-relaxed text-ink/70">
          El Testómetro es una plataforma de humor chileno y cultura popular chilena, con tests sobre chilenidad, memes, nostalgia, internet antiguo, deporte, farándula, prejuicios sociales y rarezas del Chile actual.
        </p>
      </section>
    </div>
  );
}
