import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f6f7f4",
          100: "#e8ebe3",
          200: "#d1d9c8",
          300: "#adbfa0",
          400: "#8ba888",
          500: "#6b9470",
          600: "#4a7c59",
          700: "#2d5a3d",
          800: "#254a33",
          900: "#1f3d2b",
        },
        cream: {
          DEFAULT: "#fafaf7",
          dark: "#f0ede6",
        },
        moss: {
          DEFAULT: "#2d5a3d",
          light: "#4a7c59",
        },
        earth: {
          DEFAULT: "#8b7355",
          light: "#a69076",
        },
        saffron: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FF9933",
          600: "#ea580c",
          700: "#c2410c",
        },
        india: {
          green: "#138808",
          white: "#FFFFFF",
          saffron: "#FF9933",
          navy: "#000080",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      boxShadow: {
        soft: "0 2px 20px rgba(45, 90, 61, 0.06)",
        card: "0 4px 24px rgba(45, 90, 61, 0.08)",
        "card-hover": "0 12px 40px rgba(45, 90, 61, 0.14)",
        glow: "0 0 40px rgba(107, 148, 112, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
