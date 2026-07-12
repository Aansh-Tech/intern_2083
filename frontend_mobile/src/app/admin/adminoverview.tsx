import AdminLayout from "../../components/adminoverview/AdminLayout";
import WelcomeSection from "../../components/adminoverview/WelcomeSection";
import StatsGrid from "../../components/adminoverview/StatsGrid";
import QuickActionsSection from "../../components/adminoverview/QuickActionsSection";
import ActivitySection from "../../components/adminoverview/ActivitySection";

export default function AdminOverviewScreen() {
  return (
    <AdminLayout>
      <WelcomeSection />
      <StatsGrid />
      <QuickActionsSection onManageProjects={() => {}} onReviewInbox={() => {}} />
      <ActivitySection />
    </AdminLayout>
  );
}
