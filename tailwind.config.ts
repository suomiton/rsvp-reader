import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      black: "#000000",
      navy: "#14213D",
      amber: "#FCA311",
      gray: "#E5E5E5",
      white: "#FFFFFF",
      transparent: "transparent",
      current: "currentColor",
    },
    spacing: {
      "0": "0px",
      px: "1px",
      "0.5": "4px",
      "1": "8px",
      "2": "16px",
      "3": "24px",
      "4": "32px",
      "5": "40px",
      "6": "48px",
      "8": "64px",
      "10": "80px",
      "12": "96px",
      "16": "128px",
      "20": "160px",
    },
    extend: {
      fontSize: {
        display: ["4rem", { lineHeight: "1.1" }],
        heading: ["2rem", { lineHeight: "1.2" }],
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
