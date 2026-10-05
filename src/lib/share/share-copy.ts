// Textos de invitación por test. Viven aquí y no en src/data/ para no tocar
// el archivo del Rotómetro Original.
// `headline` reemplaza la pregunta como título del test cuando hace falta
// distinguirlo (los dos Rotómetros preguntan lo mismo). `adjective` arma la
// comparación "Más chanta que el X%".
type Invitation = { question: string; cta: string; headline?: string; adjective?: string };

const invitations: Record<string, Invitation> = {
  "rotometro-original": {
    question: "¿Y tú qué tan roto eres?",
    cta: "Hacer el Rotómetro Original",
    headline: "¿Qué tan roto eras en los 2000?",
    adjective: "roto"
  },
  "rotometro-2": {
    question: "¿Y tú qué tan roto eres?",
    cta: "Hacer el Rotómetro 2.0",
    adjective: "roto"
  },
  cuicometro: {
    question: "¿Y tú qué tan cuico eres?",
    cta: "Hacer el Cuicómetro",
    adjective: "cuico"
  },
  chantometro: {
    question: "¿Y tú qué tan chanta eres?",
    cta: "Hacer el Chantómetro",
    adjective: "chanta"
  },
  farandulometro: {
    question: "¿Y tú qué tan farandulero eres?",
    cta: "Hacer el Farandulómetro",
    adjective: "farandulero"
  }
};

export function getInvitation(testSlug: string, testTitle: string): Invitation {
  return (
    invitations[testSlug] ?? {
      question: "¿Y a ti qué te sale?",
      cta: `Hacer el ${testTitle}`
    }
  );
}

// Tests cuyo `shareText` de cada grupo es una frase escrita para compartir.
// Los demás tienen "Obtuve X en el Y" y usan el formato general.
const testsWithSharePhrases = new Set(["rotometro-2", "cuicometro", "chantometro", "farandulometro"]);

// Pregunta principal del test, sin el "¿Y tú": "¿Qué tan chanta eres?".
export function getTestHeadline(testSlug: string, testTitle: string) {
  const { question, headline } = getInvitation(testSlug, testTitle);
  if (headline) return headline;
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
