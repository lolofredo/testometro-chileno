import type { CSSProperties } from "react";

// Paleta de colores de test (aprobada el 2026-10-05). Cada color lleva el
// texto que se lee bien encima: crema en los oscuros, negro en los claros.
// Todos pasan 4,5 a 1 de contraste. Para un test nuevo, elegir uno libre.
export const testPalette = {
  tomate: { bg: "#c8321d", on: "#fff8e7" },
  mostaza: { bg: "#f3b61f", on: "#17120f" },
  menta: { bg: "#2bbf8a", on: "#17120f" },
  azul: { bg: "#1c5bd6", on: "#fff8e7" },
  chicle: { bg: "#ff6fa8", on: "#17120f" },
  uva: { bg: "#6b3fd4", on: "#fff8e7" },
  naranja: { bg: "#ff7a1a", on: "#17120f" },
  celeste: { bg: "#3cc3e8", on: "#17120f" },
  palta: { bg: "#1f7a4d", on: "#fff8e7" },
  vino: { bg: "#8c1d40", on: "#fff8e7" }
} as const;

export type TestColorName = keyof typeof testPalette;

const colorBySlug: Record<string, TestColorName> = {
  chantometro: "tomate",
  cuicometro: "mostaza",
  "rotometro-2": "menta",
  "rotometro-original": "azul",
  farandulometro: "chicle"
};

const ink = "#17120f";

export type TestTheme = {
  // Fondo del test.
  bg: string;
  // Texto sobre ese fondo.
  on: string;
  // Color para textos sobre fondo claro: el del test si es oscuro, negro si
  // es claro (el amarillo o el verde no se leen sobre crema).
  text: string;
};

export function getTestTheme(slug: string): TestTheme {
  const color = testPalette[colorBySlug[slug] ?? "tomate"];
  return { bg: color.bg, on: color.on, text: color.on === ink ? ink : color.bg };
}

// Variables CSS para usar con las clases bg-test, text-test-on y text-test-text.
export function testThemeStyle(slug: string): CSSProperties {
  const theme = getTestTheme(slug);
  return {
    "--test": theme.bg,
    "--test-on": theme.on,
    "--test-text": theme.text
  } as CSSProperties;
}
