import { getAnalyticsClient } from "./events";

// "Más chanta que el X%": porcentaje de quienes terminaron el test que
// sacaron menos puntaje (función score_percentile, supabase/events-006-percentile.sql).
// Devuelve null si el test tiene menos de 50 resultados o si Supabase falla.
// Solo lee, así que funciona también en los links de prueba.
export async function fetchScorePercentile(testSlug: string, score: number) {
  const supabase = getAnalyticsClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("score_percentile", {
    p_test_slug: testSlug,
    p_score: score
  });
  if (error || typeof data !== "number") return null;
  return data;
}
