import { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, usePathname } from "expo-router";
import { isLoggedIn, logout } from "../../utils/adminAuth";
import { useTheme } from "../../context/useTheme";
import AdminOverviewHeader from "../../components/adminoverview/AdminOverviewHeader";
import AdminOverviewTabs from "../../components/adminoverview/AdminOverviewTabs";

export default function AdminLayout() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  const isLoginPage = pathname === "/admin" || pathname === "/admin/";
  const currentTab = pathname.split("/").pop() || "adminoverview";

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const loggedIn = await isLoggedIn();
    if (!loggedIn && !isLoginPage) {
      router.replace("/admin" as any);
    }
    setChecking(false);
  }

  const handleSignOut = useCallback(async () => {
    await logout();
    router.replace("/");
  }, [router]);

  const handleTabChange = useCallback(
    (tab: string) => {
      router.push(`/admin/${tab}` as any);
    },
    [router]
  );

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const stackNav = (
    <Stack key={theme}
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 200,
        gestureEnabled: true,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="adminoverview" />
      <Stack.Screen name="projects" />
      <Stack.Screen name="blog" />
      <Stack.Screen name="inbox" />
      <Stack.Screen name="comments" />
      <Stack.Screen name="skills" />
      <Stack.Screen name="about" />
    </Stack>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!isLoginPage && (
        <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.background }}>
          <AdminOverviewHeader onSignOut={handleSignOut} />
          <AdminOverviewTabs activeTab={currentTab} onTabChange={handleTabChange} />
        </SafeAreaView>
      )}
      <View style={{ flex: 1 }}>
        {stackNav}
      </View>
    </View>
  );
}
