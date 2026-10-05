import Link from "next/link";
import { Gauge } from "@/components/brand/Gauge";
import { FeaturedTest } from "@/components/home/FeaturedTest";
import { getOrderedTestCards } from "@/lib/tests/cards";

export default function NotFound() {
  const featured = getOrderedTestCards()[0];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-xl text-center">
        {/* La aguja pasada del máximo: fuera de escala. */}
        <Gauge className="mx-auto h-auto w-[200px]" size={200} sweep ticks value={1.1} />
        <p className="mt-3 text-[11px] font-black uppercase tracking-[0.09em] text-tomato">
          Error 404 · Fuera de escala
        </p>
        <h1 className="display mt-1 text-[36px] sm:text-5xl">Esta página no existe</h1>
        <p className="mx-auto mt-3 max-w-md font-semibold leading-relaxed text-ink/80">
          Puede que el link esté mal copiado o que la página ya no exista. Mientras tanto:
        </p>

        <div className="mt-6 text-left">
          <FeaturedTest card={featured} />
        </div>

        <Link
          className="focus-ring mt-4 inline-flex min-h-11 items-center justify-center text-[13px] font-black uppercase underline decoration-2 underline-offset-4"
          href="/tests"
        >
          Ver todos los tests
        </Link>
      </section>
    </div>
  );
}
