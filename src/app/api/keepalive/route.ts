import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

// Vercel Cron llama a esta ruta una vez al día (ver vercel.json) para que el
// proyecto gratuito de Supabase no se pause por 7 días sin actividad.
// Sin caché: cada llamada debe consultar de verdad a Supabase.
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error("Keepalive: faltan las variables de Supabase");
    return NextResponse.json(
      { ok: false, error: "missing-config" },
      { status: 500, headers: noStore }
    );
  }

  const { error } = await supabase.from("leaderboard_entries").select("id").limit(1);

  if (error) {
    console.error("Keepalive: Supabase no respondió", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 502, headers: noStore }
    );
  }

  return NextResponse.json(
    { ok: true, checkedAt: new Date().toISOString() },
    { headers: noStore }
  );
}
