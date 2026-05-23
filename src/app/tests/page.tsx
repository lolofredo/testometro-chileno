import { tests } from "@/data/rotometro-original";
import { TestCard } from "@/components/test/TestCard";

export default function TestsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-black uppercase text-tomato">
            Catalogo
          </p>
          <h1 className="text-5xl font-black uppercase leading-none">
            Tests disponibles
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {tests.map((test) => (
            <TestCard key={test.slug} test={test} />
          ))}
        </div>
      </section>
    </div>
  );
}
