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

// Tests cuyo `shareText` de cada grupo es una frase escrita para compartir.
// Los demás tienen "Obtuve X en el Y" y usan el formato general.
const testsWithSharePhrases = new Set(["rotometro-2", "cuicometro", "chantometro"]);

// Pregunta principal del test, sin el "¿Y tú": "¿Qué tan chanta eres?".
export function getTestHeadline(testSlug: string, testTitle: string) {
  const { question } = getInvitation(testSlug, testTitle);
  return question.replace(/^¿Y tú qué/, "¿Qué").replace(/^¿Y a ti qué/, "¿Qué");
}

export function getShareText(input: {
  testSlug: string;
  testTitle: string;
  resultTitle: string;
  sharePhrase: string;
  score: number;
}) {
  const { question } = getInvitation(input.testSlug, input.testTitle);

  if (testsWithSharePhrases.has(input.testSlug)) {
    return `«${input.sharePhrase}» Saqué ${input.score} en el ${input.testTitle} 😅 ${question}`;
  }

  return `Me salió «${input.resultTitle}» (${input.score} pts) en el ${input.testTitle} 😅 ${question}`;
}
