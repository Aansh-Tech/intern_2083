import { useState, useMemo, useCallback } from "react";
import {
  LayoutAnimation,
  Platform,
} from "react-native";
import {
  ThemeContext,
  darkTheme,
  lightTheme,
  ThemeMode,
  ThemeContextType,
} from "./ThemeContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const toggleTheme = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      colors: theme === "dark" ? darkTheme : lightTheme,
      toggleTheme,
      isDark: theme === "dark",
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
