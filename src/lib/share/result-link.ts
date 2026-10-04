import { getTestBySlug } from "@/data/tests";
import { getResultRange, getScoreBounds } from "@/lib/tests/scoring";
import type { ResultRange, TestDefinition } from "@/lib/tests/types";
import { cleanShareNickname } from "./nickname";

// El resultado compartido viaja dentro del link (/r/<test>/<token>), sin base
// de datos: funciona aunque Supabase esté caído. Nunca incluye respuestas.
type SharePayload = {
  v: 1;
  s: number;
  n: string;
};

export type SharedResult = {
  test: TestDefinition;
  score: number;
  nickname: string;
  result: ResultRange;
  token: string;
};

function toBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export function getSharePath(testSlug: string, score: number, nickname: string) {
  const payload: SharePayload = { v: 1, s: score, n: cleanShareNickname(nickname) };
  return `/r/${testSlug}/${toBase64Url(JSON.stringify(payload))}`;
}

export function getSharedResult(testSlug: string, token: string): SharedResult | null {
  const test = getTestBySlug(testSlug);
  if (!test || token.length > 200) return null;

  let payload: Partial<SharePayload>;
  try {
    payload = JSON.parse(fromBase64Url(token));
  } catch {
    return null;
  }

  const { min, max } = getScoreBounds(test);
  const score = payload.s;
  if (
    payload.v !== 1 ||
    typeof score !== "number" ||
    !Number.isInteger(score) ||
    score < min ||
    score > max ||
    typeof payload.n !== "string"
  ) {
    return null;
  }

  return {
    test,
    score,
    // Se limpia de nuevo al leer: el link pudo armarse a mano.
    nickname: cleanShareNickname(payload.n),
    result: getResultRange(test, score),
    token
  };
}
