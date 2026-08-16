import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import WelcomeSection from "../../components/adminoverview/WelcomeSection";
import StatsGrid from "../../components/adminoverview/StatsGrid";
import QuickActionsSection from "../../components/adminoverview/QuickActionsSection";
import ActivitySection from "../../components/adminoverview/ActivitySection";
import { useDashboard } from "../../context/DashboardContext";


export default function AdminOverviewScreen() {
  const router = useRouter();
  const { dashboard, refreshing, refreshDashboard } = useDashboard();
  const didRefresh = useRef(false);

  useEffect(() => {
    if (didRefresh.current) {
      return;
    }
    didRefresh.current = true;
    refreshDashboard(true).then(() => {
    }).catch((error: any) => {
    });
  }, [refreshDashboard]);

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
