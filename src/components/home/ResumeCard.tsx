"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveSessionId, getStoredSession } from "@/lib/tests/storage";

type ResumeTest = { slug: string; title: string; questionCount: number };
type Resume = { title: string; href: string; position: number; total: number };

// "Sigue donde quedaste": el test a medias más reciente de este celular.
function findResume(tests: ResumeTest[]): Resume | null {
  let best: (Resume & { updatedAt: string }) | null = null;
  try {
    for (const test of tests) {
      const sessionId = getActiveSessionId(test.slug);
      const session = sessionId ? getStoredSession(sessionId) : null;
      if (!session || session.completedAt) continue;
      const answered = Object.keys(session.answers).length;
      if (answered === 0) continue;
      if (best && best.updatedAt >= session.updatedAt) continue;
      best = {
        title: test.title,
        href: `/tests/${test.slug}/play?session=${session.sessionId}`,
        position: Math.min(answered + 1, test.questionCount),
        total: test.questionCount,
        updatedAt: session.updatedAt
      };
    }
  } catch {
    return null;
  }
  return best;
}

export function ResumeCard({ tests, tone = "dark" }: { tests: ResumeTest[]; tone?: "dark" | "light" }) {
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    setResume(findResume(tests));
  }, [tests]);

  if (!resume) return null;

  return (
    <div
      className={`flex items-center gap-3 rounded-[14px] py-3 pl-4 pr-3 ${
        tone === "dark" ? "bg-ink text-paper" : "bg-paper text-ink"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p
          className={`text-[11px] font-black uppercase tracking-[0.09em] ${
            tone === "dark" ? "text-mustard" : "text-tomato"
          }`}
        >
          Sigue donde quedaste
        </p>
        <p className="mt-0.5 text-[15px] font-bold leading-snug">
          {resume.title} · vas en la {resume.position} de {resume.total}
        </p>
      </div>
      <Link
        className={`focus-ring inline-flex min-h-11 shrink-0 items-center rounded-[10px] px-4 text-[13px] font-black uppercase tracking-[0.03em] ${
          tone === "dark" ? "bg-mustard text-ink" : "bg-ink text-paper"
        }`}
        href={resume.href}
      >
        Seguir
      </Link>
    </div>
  );
}
