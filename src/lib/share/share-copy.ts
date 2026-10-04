// Textos de invitación por test. Viven aquí y no en src/data/ para no tocar
// el archivo del Rotómetro Original.
const invitations: Record<string, { question: string; cta: string }> = {
  "rotometro-original": {
    question: "¿Y tú qué tan roto eres?",
    cta: "Hacer el Rotómetro Original"
  },
  "rotometro-2": {
    question: "¿Y tú qué tan roto eres?",
    cta: "Hacer el Rotómetro 2.0"
  },
  cuicometro: {
    question: "¿Y tú qué tan cuico eres?",
    cta: "Hacer el Cuicómetro"
  },
  chantometro: {
    question: "¿Y tú qué tan chanta eres?",
    cta: "Hacer el Chantómetro"
  }
};

export function getInvitation(testSlug: string, testTitle: string) {
  return (
    invitations[testSlug] ?? {
      question: "¿Y a ti qué te sale?",
      cta: `Hacer el ${testTitle}`
    }
  );
}

export function getShareText(input: {
  testSlug: string;
  testTitle: string;
  resultTitle: string;
  score: number;
}) {
  const { question } = getInvitation(input.testSlug, input.testTitle);
  return `Me salió «${input.resultTitle}» (${input.score} pts) en el ${input.testTitle} 😅 ${question}`;
}
