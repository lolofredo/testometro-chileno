import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-3xl border-4 border-ink bg-paper p-6 shadow-[8px_8px_0_#17120f]">
        <p className="mb-2 text-xs font-black uppercase text-tomato">
          Sobre el proyecto
        </p>
        <h1 className="mb-5 text-4xl font-black uppercase leading-none">
          Archivo jugable
        </h1>
        <p className="mb-4 font-semibold leading-relaxed text-ink/80">
          Testómetro Chileno es un sitio de tests de humor sobre Chile: preguntas
          de sí o no, resultados para compartir y rankings. Partió rescatando el
          Rotómetro, un clásico del internet chileno de los 2000, y hoy suma tests
          nuevos sobre cómo somos.
        </p>
        <p className="mb-4 font-semibold leading-relaxed text-ink/80">
          Tus respuestas se guardan de forma anónima, sin tu nickname, para estadísticas que solo se publican como totales.
        </p>
        <Link
          className="focus-ring inline-flex border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper"
          href="/tests"
        >
          Ver tests
        </Link>
      </section>
    </div>
  );
}
