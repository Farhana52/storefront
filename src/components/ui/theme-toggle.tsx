"use client";

import React from "react";
import { useTheme } from "@/context/theme-context";
import { SunIcon, MoonIcon } from "@/components/ui/icons";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun icon for dark mode */}
        <span
          className={`absolute transition-all duration-300 transform ${
            theme === "dark"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50 pointer-events-none"
          }`}
        >
          <SunIcon size={19} />
        </span>
        {/* Moon icon for light mode */}
        <span
          className={`absolute transition-all duration-300 transform ${
            theme === "dark"
              ? "opacity-0 rotate-90 scale-50 pointer-events-none"
              : "opacity-100 rotate-0 scale-100"
          }`}
        >
          <MoonIcon size={18} />
        </span>
      </div>
    </button>
  );
};
