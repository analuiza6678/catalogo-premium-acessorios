import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        branco: "#FFFFFF",
        rosa: {
          bebe: "#F8DDEB",
          claro: "#FADADD",
          blush: "#F6C8D8"
        },
        dourado: {
          DEFAULT: "#D4AF37",
          claro: "#E8C766"
        },
        bege: "#FAF7F2",
        texto: "#4B4B4B",
        preto: "#1F1F1F"
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(31, 31, 31, 0.08)",
        gold: "0 16px 42px rgba(212, 175, 55, 0.18)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pop: {
          "0%": { transform: "scale(0.96)" },
          "100%": { transform: "scale(1)" }
        }
      },
      animation: {
        fadeUp: "fadeUp 520ms ease both",
        pop: "pop 180ms ease-out"
      }
    }
  },
  plugins: []
};

export default config;
