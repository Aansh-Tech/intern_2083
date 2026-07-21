import { useEffect, useState, useCallback, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, usePathname } from "expo-router";
import { isLoggedIn, logout } from "../../utils/adminAuth";
import { useTheme } from "../../context/useTheme";
import { NotificationProvider } from "../../context/NotificationContext";
import AdminOverviewHeader from "../../components/adminoverview/AdminOverviewHeader";
import AdminOverviewTabs from "../../components/adminoverview/AdminOverviewTabs";
import NotificationPanel from "../../components/adminoverview/NotificationPanel";


console.log = () => {};
console.info = () => {};
console.debug = () => {};

export default function AdminLayout() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const mountedRef = useRef(true);

  const isLoginPage = pathname === "/admin" || pathname === "/admin/";
  const currentTab = pathname.split("/").pop() || "adminoverview";

  useEffect(() => {
    mountedRef.current = true;
    console.log("[AdminLayout] checkAuth running...");
    checkAuth();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  async function checkAuth() {
    console.log("[AdminLayout] isLoggedIn() called...");
    let loggedIn = false;
    try {
      loggedIn = await isLoggedIn();
    } catch (error: any) {
      console.log("[AdminLayout] isLoggedIn() threw:", error.message, error.stack);
    }
    if (!mountedRef.current) return;
    console.log("[AdminLayout] isLoggedIn result:", loggedIn, "isLoginPage:", isLoginPage);
    if (!loggedIn && !isLoginPage) {
      console.log("[AdminLayout] Redirecting to /admin (login page)");
      router.replace("/admin" as any);
    }
    setChecking(false);
    console.log("[AdminLayout] checkAuth complete");
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

  const handleNotificationPress = useCallback(() => {
    setShowNotifications(true);
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const stackNav = (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 2,
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
      <Stack.Screen name="certificates" />
    </Stack>
  );

  return (
    <NotificationProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {!isLoginPage && (
          <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.background }}>
            <AdminOverviewHeader onSignOut={handleSignOut} onNotificationPress={handleNotificationPress} />
            <AdminOverviewTabs activeTab={currentTab} onTabChange={handleTabChange} />
          </SafeAreaView>
        )}
        <View style={{ flex: 1 }}>
          {stackNav}
        </View>
        <NotificationPanel
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </View>
    </NotificationProvider>
  );
}