"use client";

import { useEffect, useState } from "react";
import { consentChangeEvent, getConsent, setConsent, type ConsentChoice } from "@/lib/consent";

const labels: Record<ConsentChoice, string> = {
  aceptadas: "Aceptaste Google Analytics.",
  rechazadas: "Rechazaste Google Analytics."
};

// Botones de la página de privacidad para cambiar la elección.
export function CookieChoice() {
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);

  useEffect(() => {
    setChoice(getConsent());
    const onChange = (event: Event) => setChoice((event as CustomEvent<ConsentChoice>).detail);
    window.addEventListener(consentChangeEvent, onChange);
    return () => window.removeEventListener(consentChangeEvent, onChange);
  }, []);

  const button = (active: boolean) =>
    `focus-ring min-h-[50px] flex-1 rounded-xl border-2 border-ink text-sm font-black uppercase ${
      active ? "bg-ink text-paper" : "bg-white text-ink"
    }`;

  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4">
      <p className="font-bold" role="status">
        {choice === undefined ? " " : choice ? labels[choice] : "Todavía no eliges."}
      </p>
      <div className="flex gap-3">
        <button
          aria-pressed={choice === "aceptadas"}
          className={button(choice === "aceptadas")}
          onClick={() => setConsent("aceptadas")}
          type="button"
        >
          Aceptar
        </button>
        <button
          aria-pressed={choice === "rechazadas"}
          className={button(choice === "rechazadas")}
          onClick={() => setConsent("rechazadas")}
          type="button"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
