import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { tests } from "@/data/rotometro-original";
import { TestCard } from "@/components/test/TestCard";

export default function HomePage() {
  const featured = tests[0];

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-3 inline-flex border-4 border-ink bg-mustard px-3 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#17120f]">
            Nueva maquina de tests chilenos
          </p>
          <h1 className="headline-shadow mb-5 text-5xl font-black uppercase leading-none sm:text-7xl lg:text-8xl">
            Testómetro Chileno
          </h1>
          <p className="max-w-2xl text-lg font-bold leading-relaxed text-ink/80">
            Plataforma responsive para jugar, archivar y compartir tests de
            cultura popular chilena. La primera reliquia disponible es el
            Rotómetro Original.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper shadow-[5px_5px_0_#17120f]"
              href={`/tests/${featured.slug}/start`}
            >
              Empezar ahora
              <ArrowRight size={18} strokeWidth={3} />
            </Link>
            <Link
              className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-white px-5 py-3 text-sm font-black uppercase"
              href="/tests"
            >
              Ver tests
            </Link>
          </div>
        </div>

        <div className="paper-noise border-4 border-ink bg-paper p-5 shadow-[10px_10px_0_#17120f]">
          <div className="relative">
            <div className="mb-4 border-b-4 border-ink bg-tomato px-4 py-3 text-center text-paper">
              <p className="text-sm font-black uppercase">Edicion archivo</p>
            </div>
            <div className="p-2">
              <Image
                alt="Ticket grafico de Testómetro Chileno"
                className="mb-5 w-full border-4 border-ink bg-white"
                height={420}
                src="/testometro-ticket.svg"
                width={720}
              />
              <p className="mb-2 text-xs font-black uppercase text-bluepop">
                Primer instrumento
              </p>
              <h2 className="mb-4 text-4xl font-black uppercase leading-none">
                Rotómetro Original
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="border-4 border-ink bg-white p-4">
                  <p className="text-4xl font-black">{featured.questions.length}</p>
                  <p className="text-xs font-black uppercase">preguntas</p>
                </div>
                <div className="border-4 border-ink bg-white p-4">
                  <p className="text-4xl font-black">15</p>
                  <p className="text-xs font-black uppercase">bloques</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 border-4 border-ink bg-mustard p-4">
                <Sparkles size={22} strokeWidth={3} />
                <p className="text-sm font-black uppercase">
                  Guardado automatico + ranking publico opt-in
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl">
        <TestCard test={featured} />
      </section>
    </div>
  );
}
