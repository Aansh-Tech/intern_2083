import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../context/ThemeProvider";
import { ProjectProvider } from "../context/ProjectContext";
import { InboxProvider } from "../context/InboxContext";
import { CommentProvider } from "../context/CommentContext";
import { SkillsProvider } from "../context/SkillsContext";
import { DashboardProvider } from "../context/DashboardContext";
import { useTheme } from "../context/useTheme";
import "../../global.css";

function RootLayoutInner() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 200,
          gestureEnabled: true,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
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
          <CommentProvider>
            <SkillsProvider>
              <DashboardProvider>
                <RootLayoutInner />
              </DashboardProvider>
            </SkillsProvider>
          </CommentProvider>
        </InboxProvider>
      </ProjectProvider>
    </ThemeProvider>
  );
}
