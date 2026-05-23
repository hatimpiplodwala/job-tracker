import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0E1117",
          surface: "#161B22",
          elevated: "#1C2128",
          hover: "#22272E",
        },
        border: {
          subtle: "#30363D",
          DEFAULT: "#3D444D",
        },
        text: {
          primary: "#E6EDF3",
          secondary: "#9DA7B3",
          muted: "#6E7681",
        },
        brand: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
        },
        status: {
          applied: { bg: "#1E3A8A33", text: "#93C5FD", border: "#1E40AF", dot: "#60A5FA" },
          screen: { bg: "#78350F33", text: "#FCD34D", border: "#92400E", dot: "#F59E0B" },
          interview: { bg: "#5B21B633", text: "#C4B5FD", border: "#6D28D9", dot: "#A78BFA" },
          offer: { bg: "#14532D33", text: "#86EFAC", border: "#15803D", dot: "#22C55E" },
          rejected: { bg: "#7F1D1D33", text: "#FCA5A5", border: "#991B1B", dot: "#EF4444" },
          withdrawn: { bg: "#37415133", text: "#9CA3AF", border: "#4B5563", dot: "#9CA3AF" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124, 58, 237, 0.4), 0 0 24px -8px rgba(124, 58, 237, 0.4)",
        card: "0 1px 2px rgba(0, 0, 0, 0.25), 0 1px 1px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
        "card-hover": "0 8px 24px -6px rgba(0, 0, 0, 0.45), 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        "inner-highlight": "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "inner-deep": "inset 0 1px 2px rgba(0, 0, 0, 0.35)",
        "btn-primary": "0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.15)",
        "btn-primary-hover": "0 4px 12px -2px rgba(124, 58, 237, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      },
      backgroundImage: {
        "gloss-surface": "linear-gradient(to bottom, #1A1F27, #14181F)",
        "gloss-elevated": "linear-gradient(to bottom, #1F252D, #181D24)",
        "gloss-brand": "linear-gradient(to bottom, #8B5CF6, #7C3AED)",
        "gloss-brand-hover": "linear-gradient(to bottom, #A78BFA, #8B5CF6)",
        "bar-shine": "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "fade-in": "fade-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
