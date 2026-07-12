import { useEffect, useRef, useCallback } from "react";
import { ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import AdminOverviewHeader from "./AdminOverviewHeader";
import AdminOverviewTabs from "./AdminOverviewTabs";
import { logout } from "../../utils/adminAuth";
import { useTheme } from "../../context/useTheme";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const currentTab = pathname.split("/").pop() || "adminoverview";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <AdminOverviewHeader onSignOut={handleSignOut} />
          <AdminOverviewTabs activeTab={currentTab} onTabChange={handleTabChange} />
          {children}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
