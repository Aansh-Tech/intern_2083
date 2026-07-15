import { useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/useTheme";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import WelcomeSection from "../../components/adminoverview/WelcomeSection";
import StatsGrid from "../../components/adminoverview/StatsGrid";
import QuickActionsSection from "../../components/adminoverview/QuickActionsSection";
import ActivitySection from "../../components/adminoverview/ActivitySection";
import { useDashboard } from "../../context/DashboardContext";

export default function AdminOverviewScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { dashboard, loading, refreshing, refreshDashboard } = useDashboard();

  const onRefresh = useCallback(async () => {
    await refreshDashboard();
  }, [refreshDashboard]);

  const handleActivityPress = useCallback(
    (index: number) => {
      const activity = dashboard.recentActivity[index];
      if (activity) {
        router.push(activity.route as any);
      }
    },
    [dashboard.recentActivity, router],
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AdminLayout refreshing={refreshing} onRefresh={onRefresh}>
      <WelcomeSection />
      <StatsGrid data={dashboard} />
      <QuickActionsSection
        onManageProjects={() => router.push("/admin/projects" as any)}
        onReviewInbox={() => router.push("/admin/inbox" as any)}
        unreadCount={dashboard.unreadMessages}
      />
      <ActivitySection
        activities={dashboard.recentActivity}
        onActivityPress={handleActivityPress}
      />
    </AdminLayout>
  );
}
