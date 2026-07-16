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
    //console.log("[AdminOverview] useEffect fired. didRefresh.current:", didRefresh.current);
    if (didRefresh.current) {
     // console.log("[AdminOverview] Already refreshed, skipping.");
      return;
    }
    didRefresh.current = true;
    //console.log("[AdminOverview] Calling refreshDashboard() for first time...");
    refreshDashboard().then(() => {
      //console.log("[AdminOverview] refreshDashboard() resolved.");
    }).catch((error: any) => {
      //console.log("[AdminOverview] refreshDashboard() REJECTED");
      //console.log("[AdminOverview] error.message:", error.message);
      //console.log("[AdminOverview] error.stack:", error.stack);
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
