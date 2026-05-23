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
          base: "#06080C",
          deep: "#020306",
          surface: "#161B22",
          elevated: "#1C2128",
          hover: "#262D36",
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
        "glow-brand": "0 0 18px -2px rgba(139, 92, 246, 0.5), 0 0 4px rgba(139, 92, 246, 0.25)",
        "glow-brand-soft": "0 0 12px -2px rgba(139, 92, 246, 0.35)",
        card: "0 2px 6px -1px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        "card-hover": "0 12px 32px -8px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "card-elevated": "0 8px 20px -6px rgba(0, 0, 0, 0.55), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
        "inner-highlight": "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "inner-highlight-strong": "inset 0 1px 0 rgba(255, 255, 255, 0.18)",
        "inner-deep": "inset 0 1px 2px rgba(0, 0, 0, 0.45), inset 0 -1px 0 rgba(255, 255, 255, 0.02)",
        "btn-primary": "0 2px 4px -1px rgba(0, 0, 0, 0.4), 0 0 12px -2px rgba(139, 92, 246, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
        "btn-primary-hover": "0 6px 18px -2px rgba(139, 92, 246, 0.55), 0 0 0 1px rgba(167, 139, 250, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
        "tab-active": "0 2px 8px -2px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.15)",
        "brand-mark": "0 0 14px -2px rgba(139, 92, 246, 0.55), 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
        "sidebar": "1px 0 0 rgba(255, 255, 255, 0.03), 4px 0 16px -8px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "gloss-surface": "linear-gradient(to bottom, #1C232C, #141921)",
        "gloss-elevated": "linear-gradient(to bottom, #232B36, #181D26)",
        "gloss-hero": "linear-gradient(to bottom, #2A3340, #181D26)",
        "gloss-brand": "linear-gradient(to bottom, #9F7AF7, #7C3AED)",
        "gloss-brand-hover": "linear-gradient(to bottom, #B49DF9, #8B5CF6)",
        "gloss-sidebar": "linear-gradient(to bottom, #0E1218 0%, #0A0D12 100%)",
        "gloss-tab-active": "linear-gradient(to bottom, #9F7AF7, #7C3AED)",
        "shine-h": "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1) 50%, transparent)",
        "shine-v": "linear-gradient(to bottom, rgba(255, 255, 255, 0.12), transparent 40%)",
        "bar-shine": "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 100%)",
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
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px -2px rgba(139, 92, 246, 0.4)" },
          "50%": { boxShadow: "0 0 16px -2px rgba(139, 92, 246, 0.7)" },
        },
        sheen: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "fade-in": "fade-in 200ms ease-out",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        sheen: "sheen 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
