"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { consentChangeEvent, getConsent, type ConsentChoice } from "@/lib/consent";
import { sendGooglePageView, stopGoogleAnalytics } from "@/lib/analytics/google";

// Página vista en Google Analytics al entrar y en cada cambio de página
// dentro del sitio, solo con permiso (ver lib/analytics/google.ts).
export function GoogleAnalytics() {
  const pathname = usePathname();
  const [consent, setConsentState] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    setConsentState(getConsent());
    function onChange(event: Event) {
      const choice = (event as CustomEvent<ConsentChoice>).detail;
      if (choice === "rechazadas") stopGoogleAnalytics();
      setConsentState(choice);
    }
    window.addEventListener(consentChangeEvent, onChange);
    return () => window.removeEventListener(consentChangeEvent, onChange);
  }, []);

  useEffect(() => {
    if (consent !== "aceptadas") return;
    // Un instante para que el título de la página nueva ya esté puesto.
    const timer = window.setTimeout(sendGooglePageView, 50);
    return () => window.clearTimeout(timer);
  }, [pathname, consent]);

  return null;
}
