import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        command: {
          bg: "#06090e",
          surface: "#0c1118",
          card: "#111823",
          cardHover: "#16202e",
          border: "#1f2c3d",
          borderMuted: "#151f2b",
          borderHighlight: "#2f435c",
        },
        telemetry: {
          blue: "#00b4d8",
          blueDark: "#0077b6",
          blueLight: "#90e0ef",
          cyan: "#06b6d4",
        },
        nominal: {
          DEFAULT: "#10b981",
          glow: "rgba(16, 185, 129, 0.25)",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#f59e0b",
          glow: "rgba(245, 158, 11, 0.25)",
          dark: "#d97706",
        },
        critical: {
          DEFAULT: "#ef4444",
          glow: "rgba(239, 68, 68, 0.35)",
          dark: "#b91c1c",
        },
        hazard: {
          orange: "#f97316",
          amber: "#eab308",
          purple: "#a855f7",
          brown: "#a16207",
        }
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ]
      },
      animation: {
        "radar-sweep": "radarSweep 4s linear infinite",
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-slow": "ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
