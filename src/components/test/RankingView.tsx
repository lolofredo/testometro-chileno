"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LeaderboardEntry, TestDefinition } from "@/lib/tests/types";
import { getLeaderboard } from "@/lib/tests/storage";
import { fetchRemoteLeaderboard } from "@/lib/supabase/leaderboard";
import { cleanShareNickname, RANKING_NICKNAME_MAX_LENGTH } from "@/lib/share/nickname";
import { getResultRange, getScoreBounds } from "@/lib/tests/scoring";
import { testThemeStyle } from "@/lib/tests/theme";

// La tabla acepta cualquier texto desde la clave pública, así que al mostrar
// se filtra el nickname, se descartan puntajes imposibles y el grupo se
// calcula desde el puntaje en vez de confiar en lo guardado.
function toDisplayEntries(test: TestDefinition, entries: LeaderboardEntry[]) {
  const { min, max } = getScoreBounds(test);

  return entries
    .filter((entry) => Number.isInteger(entry.score) && entry.score >= min && entry.score <= max)
    .map((entry) => ({
      ...entry,
      nickname: cleanShareNickname(entry.nickname, RANKING_NICKNAME_MAX_LENGTH),
      groupTitle: getResultRange(test, entry.score).title
    }));
}

type DisplayEntry = LeaderboardEntry;

const podiumOrder = [1, 0, 2];
const podiumHeights = ["h-[118px]", "h-[92px]", "h-[76px]"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "short" }).format(new Date(value));
}

// Los tres primeros en un podio (segundo, primero, tercero).
function Podium({ entries }: { entries: DisplayEntry[] }) {
  return (
    <ol className="grid grid-cols-3 items-end gap-2 sm:gap-3">
      {podiumOrder.map((place) => {
        const entry = entries[place];
        return (
          <li className="flex min-w-0 flex-col items-center text-center" key={place}>
            {entry ? (
              <>
                <span className="w-full truncate text-sm font-black sm:text-base">{entry.nickname}</span>
                <span className="mb-1.5 line-clamp-2 text-[11px] font-bold leading-tight text-muted">
                  {entry.groupTitle}
                </span>
              </>
            ) : (
              <span className="mb-1.5 text-sm font-bold text-muted">—</span>
            )}
            <span
              className={`flex w-full flex-col items-center justify-start rounded-t-xl pt-2 ${podiumHeights[place]} ${
                place === 0 ? "bg-test text-test-on" : "bg-ink text-paper"
              }`}
            >
              <span className="font-display text-2xl leading-none">{place + 1}°</span>
              {entry ? <span className="mt-1 text-sm font-black">{entry.score} pts</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function RankingView({
  headingLevel = "h1",
  test,
  title,
  description
}: {
  headingLevel?: "h1" | "h2";
  test: TestDefinition;
  title?: string;
  description?: string;
}) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [source, setSource] = useState<"local" | "global">("local");
  const Heading = headingLevel;

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      const remoteEntries = await fetchRemoteLeaderboard(test.slug, getScoreBounds(test));
      if (!isMounted) return;

      if (remoteEntries) {
        setEntries(toDisplayEntries(test, remoteEntries));
        setSource("global");
        return;
      }

      setEntries(toDisplayEntries(test, getLeaderboard(test.slug)));
      setSource("local");
    }

    void loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [test]);

  return (
    <section className="mt-3" style={testThemeStyle(test.slug)}>
      <div className="mb-5">
        <Heading className="display text-[28px] sm:text-5xl">{title ?? `Ranking ${test.title}`}</Heading>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm font-semibold text-ink/75">{description}</p>
        ) : null}
        <p className="mt-1 max-w-2xl text-sm font-semibold text-ink/75">
          {source === "global"
            ? "Los mejores puntajes de quienes eligieron aparecer."
            : "Mostrando solo los resultados de este celular."}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center">
          <p className="mb-4 text-xl font-black uppercase">Todavía no hay resultados públicos</p>
          <Link
            className="focus-ring inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-test px-5 text-sm font-black uppercase text-test-on"
            href={`/tests/${test.slug}/start`}
          >
            Ser el primero
            <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
          </Link>
        </div>
      ) : (
        <>
          <Podium entries={entries} />
          {entries.length > 3 ? (
            <ol className="mt-4 overflow-hidden rounded-2xl bg-white" start={4}>
              {entries.slice(3).map((entry, index) => (
                <li
                  className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-2 border-b border-ink/10 px-3 py-3 text-sm last:border-b-0 sm:grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)_auto_90px] sm:px-4"
                  key={entry.sessionId}
                >
                  <span className="font-black text-muted">{index + 4}</span>
                  <span className="truncate font-bold">{entry.nickname}</span>
                  <span className="hidden truncate font-semibold text-muted sm:block">{entry.groupTitle}</span>
                  <span className="font-black">{entry.score} pts</span>
                  <span className="hidden text-right text-xs font-semibold text-muted sm:block">
                    {formatDate(entry.completedAt)}
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
        </>
      )}
    </section>
  );
}
