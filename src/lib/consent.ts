// Elección sobre cookies (Google Analytics), guardada en este navegador.
// Sin elección, Google Analytics no se carga.

export type ConsentChoice = "aceptadas" | "rechazadas";

const consentKey = "testometro:cookies";
export const consentChangeEvent = "testometro:consent";

// Si el navegador no deja guardar, la elección dura solo esta visita.
let memoryChoice: ConsentChoice | null = null;

export function getConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(consentKey);
    if (value === "aceptadas" || value === "rechazadas") return value;
  } catch {
    // Sin localStorage se usa la elección en memoria.
  }
  return memoryChoice;
}

export function setConsent(choice: ConsentChoice) {
  memoryChoice = choice;
  try {
    window.localStorage.setItem(consentKey, choice);
  } catch {
    // Queda solo en memoria.
  }
  window.dispatchEvent(new CustomEvent(consentChangeEvent, { detail: choice }));
}
