import { useContext } from "react";
import { ThemeContext } from "../../app/providers/ThemeProvider";

/**
 * useTheme
 * Access the current theme ("light" | "dark") and the toggle function.
 * Must be used within <ThemeProvider>.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return ctx;
}