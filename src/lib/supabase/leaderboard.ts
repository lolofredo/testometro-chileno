import { getSupabaseClient, hasSupabaseConfig } from "./client";
import type { LeaderboardEntry } from "@/lib/tests/types";

type LeaderboardRow = {
  session_id: string;
  test_slug: string;
  nickname: string;
  score: number;
  group_title: string;
  completed_at: string;
};

function mapRowToEntry(row: LeaderboardRow): LeaderboardEntry {
  return {
    sessionId: row.session_id,
    testSlug: row.test_slug,
    nickname: row.nickname,
    score: row.score,
    groupTitle: row.group_title,
    completedAt: row.completed_at
  };
}

export async function fetchRemoteLeaderboard(testSlug: string) {
  if (!hasSupabaseConfig()) return null;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("leaderboard_entries")
    .select("session_id,test_slug,nickname,score,group_title,completed_at")
    .eq("test_slug", testSlug)
    .order("score", { ascending: false })
    .order("completed_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("Could not fetch remote leaderboard", error);
    return null;
  }

  return (data as LeaderboardRow[]).map(mapRowToEntry);
}

export async function addRemoteLeaderboardEntry(entry: LeaderboardEntry) {
  if (!hasSupabaseConfig()) return false;

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase.from("leaderboard_entries").insert({
    session_id: entry.sessionId,
    test_slug: entry.testSlug,
    nickname: entry.nickname,
    score: entry.score,
    group_title: entry.groupTitle,
    completed_at: entry.completedAt
  });

  if (error) {
    console.error("Could not save remote leaderboard entry", error);
    return false;
  }

  return true;
}
