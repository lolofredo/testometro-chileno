import type { QuestionFormat } from "@/lib/review-mode";

export type AnswerValue = "yes" | "no";

export type TestQuestion = {
  displayOrder: number;
  originalNumber: string;
  text: string;
  pointsYes: number;
  pointsNo: number;
};

export type ResultRange = {
  groupNumber: number;
  minScore: number;
  maxScore: number | null;
  title: string;
  shortLabel: string;
  description: string;
  shareText: string;
};

export type TestDefinition = {
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  disclaimer: string;
  version: string;
  questions: TestQuestion[];
  resultRanges: ResultRange[];
};

export type StoredSession = {
  sessionId: string;
  testSlug: string;
  // Se elige al final; vacío si la persona no puso nombre. Las sesiones
  // antiguas lo traen desde el inicio (o "Anónimo").
  nickname: string;
  isPublic: boolean;
  // Empezó el test después de abrir un resultado compartido (para medición).
  fromShare?: boolean;
  // De dónde llegó al sitio la visita en que empezó el test (para medición).
  origin?: { source: string; campaign?: string };
  answers: Record<string, AnswerValue>;
  // Formato de preguntas de la prueba A/B (sesiones antiguas no lo tienen).
  format?: QuestionFormat;
  currentBlock: number;
  // Pregunta en pantalla en el formato "una" (índice desde 0).
  currentQuestion?: number;
  completedAt?: string;
  updatedAt: string;
};

export type LeaderboardEntry = {
  sessionId: string;
  testSlug: string;
  nickname: string;
  score: number;
  groupTitle: string;
  completedAt: string;
};
