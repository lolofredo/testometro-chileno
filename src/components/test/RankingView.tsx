"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LeaderboardEntry, TestDefinition } from "@/lib/tests/types";
import { getLeaderboard } from "@/lib/tests/storage";
import { fetchRemoteLeaderboard } from "@/lib/supabase/leaderboard";

export function RankingView({ test }: { test: TestDefinition }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [source, setSource] = useState<"local" | "global">("local");

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      const remoteEntries = await fetchRemoteLeaderboard(test.slug);
      if (!isMounted) return;

      if (remoteEntries) {
        setEntries(remoteEntries);
        setSource("global");
        return;
      }

      setEntries(getLeaderboard(test.slug));
      setSource("local");
    }

    void loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [test.slug]);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 border-4 border-ink bg-paper p-5 shadow-[8px_8px_0_#17120f]">
        <p className="mb-2 text-xs font-black uppercase text-tomato">
          Marcador publico
        </p>
        <h1 className="text-4xl font-black uppercase leading-none sm:text-6xl">
          Ranking del Rotómetro
        </h1>
        <p className="mt-3 max-w-2xl font-semibold text-ink/75">
          {source === "global"
            ? "Ranking global conectado a Supabase."
            : "Ranking local de este navegador. Al configurar Supabase, esta vista mostrara el ranking global."}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="border-4 border-ink bg-white p-6 text-center shadow-[8px_8px_0_#17120f]">
          <p className="mb-4 text-xl font-black uppercase">
            Todavia no hay resultados publicos
          </p>
          <Link
            className="focus-ring inline-flex items-center justify-center gap-2 border-4 border-ink bg-tomato px-5 py-3 text-sm font-black uppercase text-paper"
            href="/tests/rotometro-original/start"
          >
            Ser el primero
            <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden border-4 border-ink bg-paper shadow-[8px_8px_0_#17120f]">
          <div className="grid grid-cols-[64px_1fr_80px] border-b-4 border-ink bg-ink px-3 py-3 text-sm font-black uppercase text-paper sm:grid-cols-[80px_1fr_100px_1fr_160px]">
            <span>#</span>
            <span>Nickname</span>
            <span>Puntos</span>
            <span className="hidden sm:block">Grupo</span>
            <span className="hidden sm:block">Fecha</span>
          </div>
          {entries.map((entry, index) => (
            <div
              className="grid grid-cols-[64px_1fr_80px] border-b-2 border-ink/20 px-3 py-4 text-sm font-bold last:border-b-0 sm:grid-cols-[80px_1fr_100px_1fr_160px]"
              key={entry.sessionId}
            >
              <span className="font-black">{index + 1}</span>
              <span>{entry.nickname}</span>
              <span className="font-black">{entry.score}</span>
              <span className="hidden sm:block">{entry.groupTitle}</span>
              <span className="hidden sm:block">
                {new Intl.DateTimeFormat("es-CL", {
                  dateStyle: "short",
                  timeStyle: "short"
                }).format(new Date(entry.completedAt))}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
