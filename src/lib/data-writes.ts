import { isReviewMode } from "./review-mode";

// Los eventos, las respuestas anónimas y el ranking solo se escriben desde
// el sitio real. Los links de prueba de Vercel y el computador de desarrollo
// leen Supabase (el ranking se ve igual) pero no escriben, para no ensuciar
// los datos. Tampoco escribe un navegador en modo revisión.
const productionHosts = ["testometro.cl", "www.testometro.cl"];

// Para probar en local contra un Supabase falso: NEXT_PUBLIC_WRITE_HOSTS=localhost
const extraHosts = (process.env.NEXT_PUBLIC_WRITE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export function canWriteData() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  if (!productionHosts.includes(host) && !extraHosts.includes(host)) return false;
  return !isReviewMode();
}
