import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Audit-document palette. Deliberately not cream/terracotta.
        // Newsprint gray, printer's ink, postal red, legal-pad yellow.
        bone: {
          DEFAULT: "#E8E5DE", // page background — gray, not cream
          50: "#F5F3EE",       // lightest
          100: "#EFECE5",
          200: "#E8E5DE",     // page
          300: "#DCD8CC",     // inset/card
          400: "#C9C4B5",
          500: "#B5AFA0",
        },
        ink: {
          DEFAULT: "#0F0F0F",
          900: "#0F0F0F",
          800: "#1A1A1A",
          700: "#2A2A2A",
          500: "#4A4A4A",
          300: "#6B6B6B",     // secondary
        },
        rule: {
          DEFAULT: "#9B968A",
          light: "#C4BFAD",
          dark: "#7A7567",
        },
        vermillion: {
          DEFAULT: "#C8321C", // postal/document red, darker than terracotta
          light: "#D62828",
          dark: "#9B1F0E",
          ink: "#7A170A",
        },
        highlight: {
          DEFAULT: "#F0E68C", // legal-pad yellow
          dark: "#D4C768",
          tint: "#FAF1B8",
        },
        gold: {
          DEFAULT: "#B8942E",
          light: "#D4AE4C",
          dark: "#8A6E1F",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
        body: ['"IBM Plex Mono"', "ui-monospace", "monospace"], // mono body — the risk
      },
      boxShadow: {
        // Sharp, paper-like — no soft glows.
        paper: "0 1px 0 0 rgba(15,15,15,0.06), 0 8px 24px -12px rgba(15,15,15,0.18)",
        "paper-lg": "0 1px 0 0 rgba(15,15,15,0.06), 0 12px 40px -16px rgba(15,15,15,0.24)",
        inset: "inset 0 0 0 1px rgba(15,15,15,0.08)",
        "inset-lg": "inset 0 0 0 1px rgba(15,15,15,0.12)",
        stamp:
          "0 2px 0 0 rgba(0,0,0,0.12), 0 4px 12px -2px rgba(0,0,0,0.25)",
        "stamp-lg":
          "0 4px 0 0 rgba(0,0,0,0.12), 0 8px 24px -4px rgba(0,0,0,0.25)",
        "exhibit":
          "0 1px 2px rgba(15,15,15,0.06), 0 0 0 1px rgba(15,15,15,0.06)",
        "exhibit-hover":
          "0 4px 16px -8px rgba(15,15,15,0.18), 0 0 0 1px rgba(15,15,15,0.12)",
      },
      backgroundImage: {
        // Subtle paper grain — barely visible, just enough to feel printed.
        "paper-grain":
          "radial-gradient(rgba(15,15,15,0.018) 1px, transparent 1px)",
        "paper-grain-dark":
          "radial-gradient(rgba(15,15,15,0.032) 1px, transparent 1px)",
        "vermillion-grad":
          "linear-gradient(135deg, #C8321C 0%, #9B1F0E 100%)",
        "ink-grad": "linear-gradient(180deg, #0F0F0F 0%, #1A1A1A 100%)",
      },
      backgroundSize: {
        grain: "3px 3px",
        "grain-lg": "4px 4px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // The stamp slam — sharp, decisive, not bouncy.
        "stamp-slam": {
          "0%": { opacity: "0", transform: "scale(1.6) rotate(-12deg)" },
          "60%": { opacity: "1", transform: "scale(0.94) rotate(-6deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-6deg)" },
        },
        // Slow pen-stroke underline that draws under a heading.
        "draw-line": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "typewriter-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "ink-spread": {
          "0%": { filter: "blur(8px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "0.06" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "fade-in-down": "fade-in-down 0.35s ease-out both",
        "fade-in-scale": "fade-in-scale 0.4s ease-out both",
        "stamp-slam": "stamp-slam 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2) both",
        "draw-line": "draw-line 0.7s ease-out 0.2s both",
        "typewriter-cursor": "typewriter-cursor 1s ease-in-out infinite",
        "ink-spread": "ink-spread 1.2s ease-out both",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out both",
        "count-up": "count-up 0.6s ease-out 0.3s both",
      },
      letterSpacing: {
        tracked: "0.18em",
        stamped: "0.32em",
        wide: "0.12em",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in-out": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};

export default config;