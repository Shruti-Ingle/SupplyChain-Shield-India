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
    },
  },
  plugins: [],
};

export default config;
