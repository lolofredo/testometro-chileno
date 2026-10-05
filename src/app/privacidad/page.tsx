import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CookieChoice } from "@/components/consent/CookieChoice";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Qué datos usa el Testómetro Chileno: medición anónima, apodo y ranking opcionales, y Google Analytics solo si aceptas.",
  alternates: {
    canonical: absoluteUrl("/privacidad")
  }
};

// Describe solo lo que el sitio hace de verdad (revisar si cambia algo de
// la medición: lib/analytics/, lib/tests/storage.ts, lib/supabase/).
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-2">
      <h2 className="display text-xl sm:text-2xl">{title}</h2>
      <div className="grid gap-2 text-base font-semibold leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-12">
      <article className="mx-auto grid max-w-2xl gap-7">
        <header>
          <h1 className="display text-[40px] sm:text-6xl">Privacidad</h1>
          <p className="mt-3 text-base font-semibold leading-relaxed text-ink/80">Actualizada en octubre de 2026.</p>
        </header>

        <Section title="Qué medimos">
          <p>
            Contamos de forma anónima cuánta gente visita el sitio, cuánta empieza, termina y comparte
            cada test, y cuántas personas respondieron sí o no a cada pregunta. No necesitas registrarte
            ni dar datos personales.
          </p>
        </Section>

        <Section title="Tu apodo y el ranking">
          <p>
            El apodo es opcional. Solo si marcas “Aparecer en el ranking”, tu apodo, puntaje, grupo y
            fecha quedan en el ranking público. Si compartes tu resultado, el link lleva tu apodo y tu
            puntaje.
          </p>
        </Section>

        <Section title="En tu teléfono">
          <p>
            Tu avance y tus resultados completos se guardan en tu navegador. A nuestros servidores solo
            llegan las cuentas anónimas de arriba y, si lo eliges, tu lugar en el ranking.
          </p>
        </Section>

        <Section title="Cookies de Google">
          <p>
            Solo si aceptas, usamos Google Analytics para contar visitas. Nunca le enviamos tu apodo ni
            tus respuestas. Si rechazas, el sitio funciona igual.
          </p>
          <CookieChoice />
        </Section>

        <Section title="Servicios que usamos">
          <p>
            Vercel aloja el sitio, Supabase guarda el ranking y las estadísticas anónimas, y Google
            Analytics solo se usa si aceptas.
          </p>
        </Section>

        <Section title="Contacto">
          <p>
            <a className="underline decoration-2 underline-offset-4" href="mailto:eltestometro@gmail.com">
              eltestometro@gmail.com
            </a>
          </p>
        </Section>
      </article>
    </div>
  );
}
