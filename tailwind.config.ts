import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17120f",
        paper: "#fff8e7",
        canvas: "#fbf6ea",
        muted: "#675d53",
        soft: "#ece4d2",
        tomato: "#c8321d",
        mustard: "#f3b61f",
        mint: "#2bbf8a",
        bluepop: "#1c5bd6",
        whatsapp: "#25d366",
        // Color del test de la pantalla (variables de lib/tests/theme.ts).
        test: "var(--test, #c8321d)",
        "test-on": "var(--test-on, #fff8e7)",
        "test-text": "var(--test-text, #c8321d)"
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Black", "Helvetica Neue", "sans-serif"]
      },
      boxShadow: {
        press: "0 12px 0 #17120f",
        lift: "0 4px 0 #17120f"
      }
    }
  },
  plugins: []
};

export default config;
