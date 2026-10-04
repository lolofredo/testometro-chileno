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
  nickname: string;
  isPublic: boolean;
  // Empezó el test después de abrir un resultado compartido (para medición).
  fromShare?: boolean;
  // De dónde llegó al sitio la visita en que empezó el test (para medición).
  origin?: { source: string; campaign?: string };
  answers: Record<string, AnswerValue>;
  currentBlock: number;
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
