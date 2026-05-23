import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17120f",
        paper: "#fff8e7",
        tomato: "#d93a24",
        mustard: "#f3b61f",
        mint: "#2bbf8a",
        bluepop: "#1c5bd6"
      },
      boxShadow: {
        press: "0 12px 0 #17120f"
      }
    }
  },
  plugins: []
};

export default config;
