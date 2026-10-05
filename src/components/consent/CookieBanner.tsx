"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { consentChangeEvent, getConsent, setConsent, type ConsentChoice } from "@/lib/consent";

// Mientras se responde un test no se muestra; si la persona aún no elige,
// vuelve a aparecer después (en el nombre, el resultado o al navegar).
const hiddenPaths = [/^\/tests\/[^/]+\/(play|start)\/?$/];

// Aviso de cookies: barra chica abajo hasta que la persona elige. Deja libre
// su alto en --cookie-bar, para que el contenido y las barras fijas de
// compartir queden encima y no debajo.
export function CookieBanner() {
  const pathname = usePathname();
  // undefined = aún no se lee la elección (al cargar no se muestra nada).
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChoice(getConsent());
    const onChange = (event: Event) => setChoice((event as CustomEvent<ConsentChoice>).detail);
    window.addEventListener(consentChangeEvent, onChange);
    return () => window.removeEventListener(consentChangeEvent, onChange);
  }, []);

  const visible = choice === null && !hiddenPaths.some((pattern) => pattern.test(pathname));

  useLayoutEffect(() => {
    const root = document.documentElement;
    const bar = barRef.current;
    if (!visible || !bar) {
      root.style.removeProperty("--cookie-bar");
      return;
    }
    const update = () => root.style.setProperty("--cookie-bar", `${bar.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--cookie-bar");
    };
  }, [visible]);

  if (!visible) return null;

  const button =
    "focus-ring h-11 w-[84px] shrink-0 rounded-lg border-2 border-paper text-[12.5px] font-black uppercase text-paper";

  return (
    <div
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[70] bg-ink text-paper"
      ref={barRef}
      role="region"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2 py-2 pl-3 pr-2 pb-[max(8px,env(safe-area-inset-bottom))] sm:gap-3 sm:px-4">
        <p className="min-w-0 flex-1 text-[12.5px] font-semibold leading-[1.25]">
          Usamos cookies de Google para contar visitas, solo si aceptas.{" "}
          <Link className="font-black underline underline-offset-2" href="/privacidad">
            Privacidad
          </Link>
        </p>
        <button className={button} onClick={() => setConsent("aceptadas")} type="button">
          Aceptar
        </button>
        <button className={button} onClick={() => setConsent("rechazadas")} type="button">
          Rechazar
        </button>
      </div>
    </div>
  );
}
