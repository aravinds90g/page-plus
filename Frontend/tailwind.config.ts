import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "void-abyss": "#030307",
        "void-deep": "#08080F",
        "obsidian-card": "#0E0E18",
        "blood-moon": "#FF3D00",
        "solar-flare": "#FF6D2E",
        "nebula-ember": "#FF9B5C",
        "starlight": "#E8E3D9",
        "void-silver": "#6B6B7B",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        wallpoet: ["Wallpoet", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
        crimson: ["Crimson Text", "serif"],
        spacemono: ["Space Mono", "monospace"],
      },
      animation: {
        "sweep-beam": "sweepBeam 20s ease-in-out infinite",
        "cosmic-drift": "cosmicDrift 18s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "cosmic-pulse": "cosmicPulse 8s ease-in-out infinite",
        "pulsar-shimmer": "pulsarShimmer 2s ease-in-out infinite",
      },
      keyframes: {
        sweepBeam: {
          "0%, 100%": { transform: "rotate(-15deg) translateX(-50%)" },
          "50%": { transform: "rotate(15deg) translateX(50%)" },
        },
        cosmicDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "25%": { transform: "translate(60px, -40px) scale(1.15) rotate(5deg)" },
          "50%": { transform: "translate(-30px, 50px) scale(0.9) rotate(-3deg)" },
          "75%": { transform: "translate(-50px, -20px) scale(1.1) rotate(2deg)" },
        },
        cosmicPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.3)", opacity: "1" },
        },
        pulsarShimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};

export default config;