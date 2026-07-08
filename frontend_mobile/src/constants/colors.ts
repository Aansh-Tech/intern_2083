export const darkTheme = {
  background: "#070B14",
  header: "#0D101A",
  card: "#0E1422",
  border: "#232838",
  primary: "#8B83FF",
  text: "#FFFFFF",
  secondaryText: "#A3A8B8",
} as const;

export const lightTheme = {
  background: "#FFFFFF",
  header: "#F8F9FC",
  card: "#FFFFFF",
  border: "#E5E7EB",
  primary: "#8B83FF",
  text: "#111827",
  secondaryText: "#6B7280",
} as const;

export type ThemeColors = typeof darkTheme;
