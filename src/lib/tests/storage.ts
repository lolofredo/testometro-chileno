"use client";

import type { QuestionFormat } from "@/lib/review-mode";
import { ANONYMOUS_NICKNAME } from "@/lib/share/nickname";
import type { AnswerValue, LeaderboardEntry, StoredSession } from "./types";

const sessionPrefix = "testometro:session:";
const activeSessionPrefix = "testometro:active:";
const leaderboardPrefix = "testometro:leaderboard:";
const lastNicknameKey = "testometro:last-nickname";
const lastPublicKey = "testometro:last-public";

export function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getActiveSessionId(testSlug: string) {
  return window.localStorage.getItem(`${activeSessionPrefix}${testSlug}`);
}

export function setActiveSessionId(testSlug: string, sessionId: string) {
  window.localStorage.setItem(`${activeSessionPrefix}${testSlug}`, sessionId);
}

export function clearActiveSessionId(testSlug: string) {
  window.localStorage.removeItem(`${activeSessionPrefix}${testSlug}`);
}

export function getStoredSession(sessionId: string) {
  const raw = window.localStorage.getItem(`${sessionPrefix}${sessionId}`);
  return raw ? (JSON.parse(raw) as StoredSession) : null;
}

export function saveStoredSession(session: StoredSession) {
  window.localStorage.setItem(
    `${sessionPrefix}${session.sessionId}`,
    JSON.stringify({ ...session, updatedAt: new Date().toISOString() })
  );
  setActiveSessionId(session.testSlug, session.sessionId);
}

export function createStoredSession(input: {
  testSlug: string;
  fromShare: boolean;
  format: QuestionFormat;
  origin?: { source: string; campaign?: string };
}) {
  // El nombre y el ranking se eligen al final del test.
  const session: StoredSession = {
    sessionId: createSessionId(),
    testSlug: input.testSlug,
    nickname: "",
    isPublic: false,
    fromShare: input.fromShare,
    ...(input.origin ? { origin: input.origin } : {}),
    answers: {},
    format: input.format,
    currentBlock: 0,
    currentQuestion: 0,
    updatedAt: new Date().toISOString()
  };

  saveStoredSession(session);
  return session;
}

export function setAnswer(
  session: StoredSession,
  questionOrder: number,
  answer: AnswerValue
) {
  const nextSession: StoredSession = {
    ...session,
    answers: {
      ...session.answers,
      [String(questionOrder)]: answer
    }
  };

  saveStoredSession(nextSession);
  return nextSession;
}

export function clearAnswer(session: StoredSession, questionOrder: number) {
  const nextAnswers = { ...session.answers };
  delete nextAnswers[String(questionOrder)];

  const nextSession: StoredSession = {
    ...session,
    answers: nextAnswers
  };

  saveStoredSession(nextSession);
  return nextSession;
}

export function setCurrentBlock(session: StoredSession, currentBlock: number) {
  const nextSession: StoredSession = {
    ...session,
    currentBlock
  };

  saveStoredSession(nextSession);
  return nextSession;
}

export function setCurrentQuestion(session: StoredSession, currentQuestion: number) {
  const nextSession: StoredSession = { ...session, currentQuestion };
  saveStoredSession(nextSession);
  return nextSession;
}

export function completeSession(
  session: StoredSession,
  choice: { nickname: string; isPublic: boolean }
) {
  const nextSession: StoredSession = {
    ...session,
    nickname: choice.nickname,
    isPublic: choice.isPublic,
    completedAt: session.completedAt ?? new Date().toISOString()
  };

  saveStoredSession(nextSession);
  clearActiveSessionId(session.testSlug);
  return nextSession;
}

// Sin nombre: vacío, o "Anónimo" en las sesiones antiguas y en los nombres
// que el filtro rechaza.
export function hasChosenNickname(nickname: string) {
  return nickname.trim() !== "" && nickname !== ANONYMOUS_NICKNAME;
}

// Último nombre y elección de ranking, para no pedirlos de nuevo en el
// siguiente test.
export function getLastNameChoice() {
  try {
    return {
      nickname: window.localStorage.getItem(lastNicknameKey) ?? "",
      isPublic: window.localStorage.getItem(lastPublicKey) === "1"
    };
  } catch {
    return { nickname: "", isPublic: false };
  }
}

export function saveLastNameChoice(choice: { nickname: string; isPublic: boolean }) {
  try {
    if (choice.nickname) window.localStorage.setItem(lastNicknameKey, choice.nickname);
    window.localStorage.setItem(lastPublicKey, choice.isPublic ? "1" : "0");
  } catch {
    // Sin localStorage se vuelve a escribir la próxima vez.
  }
}

// Tests que esta persona ya terminó en este celular (para recomendar otro).
export function getCompletedTestSlugs() {
  const slugs = new Set<string>();
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith(sessionPrefix)) continue;
      const session = JSON.parse(window.localStorage.getItem(key) ?? "null") as StoredSession | null;
      if (session?.completedAt) slugs.add(session.testSlug);
    }
  } catch {
    // Sin localStorage se recomienda igual, sin saber qué hizo.
  }
  return slugs;
}

export function getLeaderboard(testSlug: string) {
  const raw = window.localStorage.getItem(`${leaderboardPrefix}${testSlug}`);
  return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
}

export function addLeaderboardEntry(entry: LeaderboardEntry) {
  if (!entry.testSlug) return;

  const entries = getLeaderboard(entry.testSlug).filter(
    (item) => item.sessionId !== entry.sessionId
  );
  const nextEntries = [...entries, entry]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
    })
    .slice(0, 50);

  window.localStorage.setItem(
    `${leaderboardPrefix}${entry.testSlug}`,
    JSON.stringify(nextEntries)
  );
}
