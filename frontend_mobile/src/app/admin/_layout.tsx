import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, usePathname } from "expo-router";
import { isLoggedIn } from "../../utils/adminAuth";
import { useTheme } from "../../context/useTheme";

export default function AdminLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const loggedIn = await isLoggedIn();
    const isLoginPage = pathname === "/admin" || pathname === "/admin/";

    if (!loggedIn && !isLoginPage) {
      router.replace("/admin" as any);
    }
    setChecking(false);
  }

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
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
}
