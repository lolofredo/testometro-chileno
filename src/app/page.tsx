import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Images, Play } from "lucide-react";
import { getInvitation, getTestHeadline } from "@/lib/share/share-copy";
import { getDurationLabel, getEstimatedMinutesForCount } from "@/lib/tests/duration";
import { getFeaturedTest } from "@/lib/tests/featured";
import { catalogTests, type CatalogTest } from "@/data/test-catalog";
import { memes } from "@/data/memes";
import { absoluteUrl, siteConfig, siteOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Testómetro Chileno | Tests chilenos, memes y humor chileno",
  description:
    "Plataforma de tests chilenos, memes chilenos, humor y cultura popular chilena: Rotómetro Original, Rotómetro 2.0, Cuicómetro, Chantómetro y nostalgia del Chile actual.",
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: "Testómetro Chileno",
    description:
      "Tests chilenos de humor, cultura popular chilena, memes, nostalgia, Rotómetro, Cuicómetro y Chantómetro.",
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

// Los tests marcados "Nuevo" van primero.
const homeTests: CatalogTest[] = [
  ...catalogTests.filter((item) => item.label === "Nuevo"),
  ...catalogTests.filter((item) => item.label !== "Nuevo")
];

function HeroTestItem({ item }: { item: CatalogTest }) {
  const isAvailable = item.status === "available";

  const content = (
    <div
      className={`grid gap-3 border-4 border-ink bg-white p-4 transition ${
        isAvailable
          ? "shadow-[5px_5px_0_#17120f] hover:-translate-y-0.5 hover:bg-mustard"
          : "opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`mb-2 inline-flex border-2 border-ink px-2 py-1 text-[11px] font-black uppercase ${
              item.label === "Nuevo" ? "bg-mustard" : isAvailable ? "bg-mint" : "bg-paper"
            }`}
          >
            {item.label}
          </p>
          <h2 className="text-2xl font-black uppercase leading-none">
            {item.title}
          </h2>
        </div>
        <span
          className={`grid size-10 shrink-0 place-items-center border-4 border-ink ${
            isAvailable ? "bg-tomato text-paper" : "bg-paper"
          }`}
        >
          {isAvailable ? (
            <Play size={18} fill="currentColor" strokeWidth={3} />
          ) : (
            <Clock size={18} strokeWidth={3} />
          )}
        </span>
      </div>
      <p className="text-sm font-bold leading-relaxed text-ink/75">
        {item.description}
      </p>
      {item.questionCount ? (
        <div className="flex flex-wrap gap-2 text-xs font-black uppercase">
          <span className="border-2 border-ink bg-paper px-2 py-1">
            {item.questionCount} preguntas
          </span>
          <span className="border-2 border-ink bg-paper px-2 py-1">
            {getEstimatedMinutesForCount(item.questionCount)} min
          </span>
        </div>
      ) : null}
    </div>
  );

  if (!item.href) {
    return content;
  }

  return (
    <Link className="focus-ring block" href={item.href}>
      {content}
    </Link>
  );
}

export default function HomePage() {
  // El test destacado ("Nuevo"; si no hay, el Cuicómetro) va en la primera pantalla.
  const featured = getFeaturedTest();
  const featuredInvitation = getInvitation(featured.slug, featured.title);
  const featuredLabel =
    catalogTests.find((item) => item.slug === featured.slug)?.label === "Nuevo" ? "Nuevo" : "Destacado";
  const featuredMemes = memes.slice(0, 6);

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div>
          <h1 className="headline-shadow text-4xl font-black uppercase leading-none sm:text-6xl lg:text-7xl">
            Testómetro Chileno
          </h1>
          <p className="mt-3 max-w-2xl text-lg font-bold leading-snug text-ink/80">
            Tests chilenos de humor. Sí o no, 3 minutos, sin registro.
          </p>

          <div className="mt-5 border-4 border-ink bg-white shadow-[8px_8px_0_#17120f]">
            <div className="p-5">
              <p className="mb-3 inline-flex border-2 border-ink bg-mustard px-2 py-1 text-[11px] font-black uppercase">
                {featuredLabel} · {featured.title}
              </p>
              <p className="text-3xl font-black uppercase leading-none sm:text-5xl">
                {getTestHeadline(featured.slug, featured.title)}
              </p>
              <p className="mt-2 text-sm font-bold text-ink/70">
                {featured.questions.length} preguntas de sí o no · {getDurationLabel(featured)}
              </p>
              <Link
                className="focus-ring mt-4 flex w-full items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-4 text-base font-black uppercase text-paper shadow-[5px_5px_0_#17120f] sm:w-auto sm:px-8"
                href={`/tests/${featured.slug}/start`}
              >
                {featuredInvitation.cta}
                <ArrowRight size={20} strokeWidth={3} />
              </Link>
            </div>
          </div>
          <Link
            className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-black uppercase underline decoration-2 underline-offset-4"
            href="/tests"
          >
            Ver todos los tests
            <ArrowRight size={16} strokeWidth={3} />
          </Link>

        </div>

        <aside className="border-4 border-ink bg-paper p-4 shadow-[10px_10px_0_#17120f] sm:p-5 lg:sticky lg:top-28">
          <div className="mb-4 border-b-4 border-ink bg-tomato px-4 py-3 text-paper">
            <p className="text-center text-sm font-black uppercase">
              Tests disponibles
            </p>
          </div>
          <div className="grid gap-3">
            {homeTests.map((item) => (
              <HeroTestItem item={item} key={item.slug} />
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="border-4 border-ink bg-paper p-4 shadow-[10px_10px_0_#17120f] sm:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 inline-flex border-4 border-ink bg-mustard px-3 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#17120f]">
                Memes del archivo
              </p>
              <h2 className="headline-shadow text-4xl font-black uppercase leading-none sm:text-6xl">
                Cultura para compartir
              </h2>
            </div>
            <Link
              className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper shadow-[5px_5px_0_#17120f]"
              href="/memes"
            >
              Ver memes
              <ArrowRight size={18} strokeWidth={3} />
            </Link>
          </div>

          <Link
            aria-label="Ver la galería completa de memes"
            className="focus-ring group block"
            href="/memes"
          >
            <div className="flex snap-x gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch]">
              {featuredMemes.map((meme) => (
                <article
                  className="min-w-[78%] snap-start overflow-hidden border-4 border-ink bg-white shadow-[6px_6px_0_#17120f] transition group-hover:shadow-[8px_8px_0_#17120f] sm:min-w-[360px] lg:min-w-[31%]"
                  key={meme.slug}
                >
                  <Image
                    alt={meme.alt}
                    className="aspect-square w-full bg-paper object-contain"
                    height={900}
                    src={meme.imageSrc}
                    width={900}
                  />
                  <div className="border-t-4 border-ink p-4">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-tomato">
                      <Images size={15} strokeWidth={3} />
                      Meme
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="mb-2 text-sm font-black uppercase text-ink/60">Sobre el Testómetro</h2>
        <p className="max-w-3xl text-sm font-semibold leading-relaxed text-ink/70">
          El Testómetro es una plataforma de humor chileno y cultura popular chilena, con tests sobre chilenidad, memes, nostalgia, internet antiguo, deporte, farándula, prejuicios sociales y rarezas del Chile actual.
        </p>
      </section>
    </div>
  );
}
