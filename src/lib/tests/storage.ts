"use client";

import type { AnswerValue, LeaderboardEntry, StoredSession } from "./types";

const sessionPrefix = "testometro:session:";
const activeSessionPrefix = "testometro:active:";
const leaderboardPrefix = "testometro:leaderboard:";

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
  nickname: string;
  isPublic: boolean;
  fromShare: boolean;
  origin?: { source: string; campaign?: string };
}) {
  const session: StoredSession = {
    sessionId: createSessionId(),
    testSlug: input.testSlug,
    nickname: input.nickname,
    isPublic: input.isPublic,
    fromShare: input.fromShare,
    ...(input.origin ? { origin: input.origin } : {}),
    answers: {},
    currentBlock: 0,
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

export function completeSession(session: StoredSession) {
  const nextSession: StoredSession = {
    ...session,
    completedAt: new Date().toISOString()
  };

  saveStoredSession(nextSession);
  clearActiveSessionId(session.testSlug);
  return nextSession;
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
