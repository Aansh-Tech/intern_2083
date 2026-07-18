import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { Stack } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import { ThemeProvider } from "../context/ThemeProvider";
import { ProfileProvider } from "../context/ProfileContext";
import { ProjectProvider } from "../context/ProjectContext";
import { InboxProvider } from "../context/InboxContext";
import { CommentProvider } from "../context/CommentContext";
import { SkillsProvider } from "../context/SkillsContext";
import { DashboardProvider } from "../context/DashboardContext";
import { CertificateProvider } from "../context/CertificateContext";
import { useTheme } from "../context/useTheme";
import "../../global.css";

function RootLayoutInner() {
  const { isDark, colors } = useTheme();

  useEffect(() => {
    console.log("[RootLayout] Inner mounted. All context providers active.");
    return () => console.log("[RootLayout] Inner unmounted.");
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setStyle(isDark ? "dark" : "light");
    }
  }, [isDark]);

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
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <CertificateProvider>
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
        </CertificateProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
