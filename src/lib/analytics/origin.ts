// Origen de la visita: de dónde llegó la persona al sitio. Se fija al entrar
// y dura toda la visita (sessionStorage de la pestaña). Solo se guarda una
// categoría y una campaña, nunca la dirección completa.

export type VisitOrigin = {
  source: string;
  campaign?: string;
};

const originKey = "testometro:origin";

// Mismas reglas que la tabla events (supabase/events-003-origin.sql).
const sourcePattern = /^[a-z0-9_-]{1,40}$/;
const campaignPattern = /^[a-z0-9_-]{1,60}$/;

// Nombres alternativos de utm_source que se juntan en una sola categoría.
const sourceAliases: Record<string, string> = {
  ig: "instagram",
  "instagram.com": "instagram",
  fb: "facebook",
  "facebook.com": "facebook",
  wa: "whatsapp",
  "whatsapp.com": "whatsapp",
  twitter: "x",
  "x.com": "x",
  "t.co": "x",
  "tiktok.com": "tiktok",
  "chatgpt.com": "chatgpt",
  openai: "chatgpt",
  "google.com": "google",
  "bing.com": "bing"
};

// Dominio de la página anterior -> categoría.
const referrerRules: [RegExp, string][] = [
  [/(^|\.)google\.|googlequicksearchbox/, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.me$/, "facebook"],
  [/(^|\.)whatsapp\.(com|net)$|^wa\.me$/, "whatsapp"],
  [/(^|\.)(x|twitter)\.com$|^t\.co$/, "x"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, "chatgpt"]
];

function slugify(value: string, maxLength: number) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .replace(/[\s.]+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength);
}

export function normalizeSource(raw: string) {
  const lower = raw.trim().toLowerCase().replace(/^www\./, "");
  const source = sourceAliases[lower] ?? slugify(lower, 40);
  return sourcePattern.test(source) ? source : "otro";
}

export function normalizeCampaign(raw: string | null) {
  if (!raw) return undefined;
  const campaign = slugify(raw, 60);
  return campaignPattern.test(campaign) ? campaign : undefined;
}

export function classifyReferrer(referrer: string) {
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "otro";
  }
  return referrerRules.find(([pattern]) => pattern.test(host))?.[1] ?? "otro";
}

function readOrigin(): VisitOrigin | null {
  try {
    const raw = window.sessionStorage.getItem(originKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VisitOrigin;
    if (typeof parsed.source !== "string" || !sourcePattern.test(parsed.source)) return null;
    if (parsed.campaign !== undefined && !campaignPattern.test(parsed.campaign)) {
      return { source: parsed.source };
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveOrigin(origin: VisitOrigin) {
  try {
    window.sessionStorage.setItem(originKey, JSON.stringify(origin));
  } catch {
    // Sin sessionStorage no se recuerda el origen entre páginas.
  }
}

// Se llama en cada carga completa de página. Un link con utm_source siempre
// manda; si no, solo se fija el origen la primera vez de la visita.
export function captureVisitOrigin(pageUrl: string, referrer: string) {
  let params: URLSearchParams;
  try {
    params = new URL(pageUrl).searchParams;
  } catch {
    params = new URLSearchParams();
  }

  const utmSource = params.get("utm_source");
  if (utmSource) {
    const campaign = normalizeCampaign(params.get("utm_campaign"));
    saveOrigin({ source: normalizeSource(utmSource), ...(campaign ? { campaign } : {}) });
    return;
  }

  if (readOrigin()) return;

  let referrerHost = "";
  try {
    referrerHost = referrer ? new URL(referrer).host : "";
  } catch {
    referrerHost = "";
  }
  const isInternal = referrerHost !== "" && referrerHost === new URL(pageUrl).host;

  saveOrigin({ source: !referrer || isInternal ? "directo" : classifyReferrer(referrer) });
}

export function getVisitOrigin(): VisitOrigin | undefined {
  return readOrigin() ?? undefined;
}
