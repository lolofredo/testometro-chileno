import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { VisitOrigin } from "./origin";

// Eventos de medición en la tabla `events` de Supabase (ver supabase/events.sql).
// Sin nickname ni respuestas. Si Supabase falla, el evento se pierde y el
// sitio sigue igual.

export type EventName =
  | "test_started"
  | "test_completed"
  | "block_completed"
  | "share_click"
  | "shared_link_opened"
  | "shared_link_cta_click";

export type ShareChannel = "whatsapp" | "native" | "x" | "copy" | "story";

type EventData = {
  testSlug: string;
  sessionId?: string;
  channel?: ShareChannel;
  score?: number;
  fromShare?: boolean;
  // Número de bloque (desde 1), solo en block_completed.
  block?: number;
  // Origen de la visita, solo en test_started y test_completed.
  origin?: VisitOrigin;
};

const fromShareKey = "testometro:from-share";
const fromShareWindowMs = 24 * 60 * 60 * 1000;

let client: SupabaseClient | null | undefined;

function getEventsClient() {
  if (client !== undefined) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client =
    url && anonKey
      ? createClient(url, anonKey, {
          auth: { persistSession: false, autoRefreshToken: false },
          // keepalive: el evento llega aunque la persona cambie de página.
          global: { fetch: (input, init) => fetch(input, { ...init, keepalive: true }) }
        })
      : null;
  return client;
}

export function trackEvent(event: EventName, data: EventData) {
  const supabase = getEventsClient();
  if (!supabase) return;

  void supabase
    .from("events")
    .insert({
      event,
      test_slug: data.testSlug,
      session_id: data.sessionId ?? null,
      channel: data.channel ?? null,
      score: data.score ?? null,
      from_share: data.fromShare ?? false,
      // Las columnas `block`, `source` y `campaign` solo se envían cuando
      // hay dato, para que los demás eventos no fallen si la tabla aún no
      // las tiene.
      ...(data.block !== undefined ? { block: data.block } : {}),
      ...(data.origin ? { source: data.origin.source, campaign: data.origin.campaign ?? null } : {})
    })
    .then(({ error }) => {
      if (error) console.warn("Could not track event", event, error.message);
    });
}

// Marca que esta persona llegó desde un resultado compartido, para saber si
// el test que empiece después vino de un link.
export function markArrivedFromShare() {
  try {
    window.localStorage.setItem(fromShareKey, String(Date.now()));
  } catch {
    // Sin localStorage no se mide el origen.
  }
}

export function arrivedFromShare() {
  try {
    const markedAt = Number(window.localStorage.getItem(fromShareKey));
    return Boolean(markedAt) && Date.now() - markedAt < fromShareWindowMs;
  } catch {
    return false;
  }
}
