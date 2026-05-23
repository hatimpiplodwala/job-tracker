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
          applied: { bg: "#1E3A8A33", text: "#93C5FD", border: "#1E40AF" },
          screen: { bg: "#78350F33", text: "#FCD34D", border: "#92400E" },
          interview: { bg: "#5B21B633", text: "#C4B5FD", border: "#6D28D9" },
          offer: { bg: "#14532D33", text: "#86EFAC", border: "#15803D" },
          rejected: { bg: "#7F1D1D33", text: "#FCA5A5", border: "#991B1B" },
          withdrawn: { bg: "#37415133", text: "#9CA3AF", border: "#4B5563" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124, 58, 237, 0.4), 0 0 24px -8px rgba(124, 58, 237, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
