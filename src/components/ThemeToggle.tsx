"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-background-light/80 dark:bg-primary-600/80 backdrop-blur-lg border border-primary-50/20 dark:border-primary-200/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-400/50"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-text-primary dark:text-text-light" />
      ) : (
        <Sun className="w-5 h-5 text-accent-medium" />
      )}
    </button>
  );
}
