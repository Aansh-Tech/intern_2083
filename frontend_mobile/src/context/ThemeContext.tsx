import { createContext } from "react";

export type ThemeMode = "dark" | "light";

export type ThemeColors = {
  background: string;
  header: string;
  card: string;
  border: string;
  primary: string;
  text: string;
  secondaryText: string;
};

export const darkTheme: ThemeColors = {
  background: "#070B14",
  header: "#0D101A",
  card: "#0E1422",
  border: "#232838",
  primary: "#8B83FF",
  text: "#FFFFFF",
  secondaryText: "#A3A8B8",
};

export const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  header: "#F8F9FC",
  card: "#FFFFFF",
  border: "#E5E7EB",
  primary: "#8B83FF",
  text: "#111827",
  secondaryText: "#6B7280",
};

export type ThemeContextType = {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  colors: darkTheme,
  toggleTheme: () => {},
  isDark: true,
});
