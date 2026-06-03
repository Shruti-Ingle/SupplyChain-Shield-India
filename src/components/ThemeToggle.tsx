"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed top-4 right-4 z-[9999] flex h-11 w-11 items-center justify-center rounded-full border border-sage-200 bg-white/90 text-sage-800 shadow-soft backdrop-blur hover:bg-sage-50 dark:border-sage-700 dark:bg-sage-900/90 dark:text-cream dark:hover:bg-sage-800"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
