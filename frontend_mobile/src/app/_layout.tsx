import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../context/ThemeProvider";
import { ProjectProvider } from "../context/ProjectContext";
import { InboxProvider } from "../context/InboxContext";
import { useTheme } from "../context/useTheme";
import "../../global.css";

function RootLayoutInner() {
  const { isDark } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admin" />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <InboxProvider>
          <RootLayoutInner />
        </InboxProvider>
      </ProjectProvider>
    </ThemeProvider>
  );
}
