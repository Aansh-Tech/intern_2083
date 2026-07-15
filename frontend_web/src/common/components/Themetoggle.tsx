import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      className="
        flex h-10 w-10 items-center justify-center rounded-full
        border border-slate-200 text-slate-700 transition-colors
        hover:border-indigo-300 hover:text-indigo-600
        dark:border-slate-700 dark:text-slate-200
        dark:hover:border-indigo-400 dark:hover:text-indigo-300
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-indigo-500
      "
    >
      {theme === "light" ? (
        <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      ) : (
        <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} />
      )}
    </button>
  );
}