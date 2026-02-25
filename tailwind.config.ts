import type { Config } from "tailwindcss";

// Tailwind config enrichi pour les deux modes (CV clair + Dev sombre)
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // darkMode class permet de switch programmatiquement via le hook useMode
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // CV Mode palette : neutrals + accent bleu profond
        cv: {
          bg: "#FAFAFA",
          surface: "#FFFFFF",
          text: "#0F0F0F",
          muted: "#6B7280",
          accent: "#1E40AF",
          "accent-light": "#3B82F6",
          border: "#E5E7EB",
        },
        // Dev Mode palette : dark profond + néon vert/cyan
        dev: {
          bg: "#050810",
          surface: "#0D1117",
          "surface-2": "#161B22",
          text: "#E6EDF3",
          muted: "#8B949E",
          accent: "#00FF88",
          "accent-2": "#00D4FF",
          "accent-3": "#FF6B6B",
          border: "#21262D",
          terminal: "#0C1221",
        },
      },
      fontFamily: {
        // Variable fonts pour CV Mode — élégance typographique
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Monospace pour Dev Mode — authenticité technique
        mono: ["var(--font-jetbrains)", "Fira Code", "monospace"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "glitch-1": "glitch1 0.3s infinite",
        "glitch-2": "glitch2 0.3s infinite",
        typewriter: "typewriter 0.05s steps(1) forwards",
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glitch1: {
          "0%, 100%": { clipPath: "inset(0 0 0 0)", transform: "translateX(0)" },
          "20%": { clipPath: "inset(20% 0 60% 0)", transform: "translateX(-3px)" },
          "40%": { clipPath: "inset(50% 0 20% 0)", transform: "translateX(3px)" },
          "60%": { clipPath: "inset(10% 0 80% 0)", transform: "translateX(-2px)" },
          "80%": { clipPath: "inset(70% 0 10% 0)", transform: "translateX(2px)" },
        },
        glitch2: {
          "0%, 100%": { clipPath: "inset(0 0 0 0)", transform: "translateX(0)" },
          "20%": { clipPath: "inset(60% 0 20% 0)", transform: "translateX(3px)" },
          "40%": { clipPath: "inset(10% 0 70% 0)", transform: "translateX(-3px)" },
          "60%": { clipPath: "inset(80% 0 5% 0)", transform: "translateX(2px)" },
          "80%": { clipPath: "inset(30% 0 50% 0)", transform: "translateX(-2px)" },
        },
        pulseNeon: {
          "0%, 100%": { boxShadow: "0 0 5px #00FF88, 0 0 10px #00FF88" },
          "50%": { boxShadow: "0 0 20px #00FF88, 0 0 40px #00FF88" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backgroundImage: {
        "grid-dark": "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
