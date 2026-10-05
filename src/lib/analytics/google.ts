import { getConsent } from "@/lib/consent";
import { isReviewMode } from "@/lib/review-mode";

// Google Analytics 4, solo con permiso. El script de Google no se carga ni
// deja cookies hasta que la persona acepta; si rechaza, no se carga nunca.
// Solo en testometro.cl (no en los links de prueba, en local ni en modo
// revisión). La medición propia en Supabase (events.ts) no depende de esto.
// Señales publicitarias y personalización de anuncios: apagadas.
//
// En Google Analytics, la "medición mejorada" del flujo web debe estar
// apagada: las páginas vistas se envían desde aquí, sin el código de los
// resultados compartidos.
export const GA_MEASUREMENT_ID = "G-CB205JSXSE";

const gaHosts = ["testometro.cl", "www.testometro.cl"];

// Solo para pruebas en local con las llamadas a Google interceptadas.
const testHosts = (process.env.NEXT_PUBLIC_GA_TEST_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let loaded = false;

function hostAllowed() {
  const host = window.location.hostname;
  return gaHosts.includes(host) || testHosts.includes(host);
}

export function googleAnalyticsAllowed() {
  if (typeof window === "undefined" || !/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)) return false;
  return hostAllowed() && !isReviewMode() && getConsent() === "aceptadas";
}

// Dirección y título que se le mandan a Google: en /r/<test>/<código> el
// código lleva el resultado y el apodo, y el título de esa página también;
// /results/<sesión> va sin el código de la sesión. Solo se conservan los
// parámetros utm.
function sanitizeUrl(rawUrl: string) {
  const url = new URL(rawUrl);
  let path = url.pathname;
  const shared = path.match(/^\/r\/([^/]+)\//);
  if (shared) path = `/r/${shared[1]}`;
  if (path.startsWith("/results/")) path = "/results";
  const params = new URLSearchParams();
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = url.searchParams.get(key);
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return `${url.origin}${path}${query ? `?${query}` : ""}`;
}

function currentPage() {
  const isShared = /^\/r\//.test(window.location.pathname);
  let referrer = document.referrer;
  try {
    if (referrer && new URL(referrer).origin === window.location.origin) referrer = sanitizeUrl(referrer);
  } catch {
    referrer = "";
  }
  return {
    page_location: sanitizeUrl(window.location.href),
    page_title: isShared ? "Resultado compartido" : document.title,
    page_referrer: referrer
  };
}

function loadGoogleAnalytics() {
  if (!googleAnalyticsAllowed()) return null;
  const flags = window as unknown as Record<string, unknown>;
  if (loaded && window.gtag) {
    // Aceptó de nuevo después de rechazar en esta misma visita.
    if (flags[`ga-disable-${GA_MEASUREMENT_ID}`]) {
      flags[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
    return window.gtag;
  }

  window.dataLayer = window.dataLayer ?? [];
  // gtag.js espera el objeto `arguments`, no un arreglo.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  flags[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted"
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...currentPage()
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  loaded = true;
  return window.gtag;
}

export function sendGooglePageView() {
  const gtag = loadGoogleAnalytics();
  if (!gtag) return;
  const page = currentPage();
  // `set` hace que los eventos siguientes también lleven la dirección limpia.
  gtag("set", page);
  gtag("event", "page_view", page);
}

export function sendGoogleEvent(
  name: string,
  params: { test_slug: string; question_format?: string; share_channel?: string }
) {
  const gtag = loadGoogleAnalytics();
  if (!gtag) return;
  const clean: Record<string, string> = { test_slug: params.test_slug };
  if (params.question_format) clean.question_format = params.question_format;
  if (params.share_channel) clean.share_channel = params.share_channel;
  gtag("event", name, clean);
}

// Al rechazar después de haber aceptado: Google deja de recibir datos en
// esta visita y se borran sus cookies.
export function stopGoogleAnalytics() {
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  const host = window.location.hostname;
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("_ga")) continue;
    for (const domain of ["", `; domain=${host}`, `; domain=.${host.replace(/^www\./, "")}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}
