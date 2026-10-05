import type { Metadata } from "next";
import Link from "next/link";
import { Gauge } from "@/components/brand/Gauge";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sobre el proyecto",
  description:
    "Testómetro Chileno es un archivo jugable de tests chilenos, humor, cultura popular chilena, memes y nostalgia digital.",
  keywords: [
    ...siteConfig.keywords,
    "archivo de cultura popular chilena",
    "humor chileno",
    "internet chileno antiguo"
  ],
  alternates: {
    canonical: absoluteUrl("/about")
  }
};

export default function AboutPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-3xl">
        <Gauge className="mb-4 h-auto w-[150px]" size={150} value={0.72} />
        <p className="text-[11px] font-black uppercase tracking-[0.09em] text-tomato">
          Sobre el proyecto
        </p>
        <h1 className="display mb-5 mt-1 text-[40px] sm:text-6xl">
          Archivo jugable
        </h1>
        <p className="mb-4 text-base font-semibold leading-relaxed text-ink/80 sm:text-lg">
          Testómetro Chileno es un sitio de tests de humor sobre Chile: preguntas
          de sí o no, resultados para compartir y rankings. Partió rescatando el
          Rotómetro, un clásico del internet chileno de los 2000, y hoy suma tests
          nuevos sobre cómo somos.
        </p>
        <p className="mb-4 text-base font-semibold leading-relaxed text-ink/80 sm:text-lg">
          Tus respuestas se guardan de forma anónima, sin tu nickname, para estadísticas que solo se publican como totales.
        </p>
        <Link
          className="focus-ring mt-2 inline-flex min-h-[52px] items-center rounded-xl bg-tomato px-6 text-sm font-black uppercase text-paper shadow-lift"
          href="/tests"
        >
          Ver tests
        </Link>
      </section>
    </div>
  );
}
