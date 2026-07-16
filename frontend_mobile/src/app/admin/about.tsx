import { useCallback } from "react";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import AboutControl from "../../components/admin_about/AboutControl";
import { useProfile } from "../../context/ProfileContext";

export default function AdminAboutScreen() {
  const { refreshing, refreshProfile } = useProfile();

  const onRefresh = useCallback(async () => {
    await refreshProfile();
  }, [refreshProfile]);

  return (
    <AdminLayout refreshing={refreshing} onRefresh={onRefresh}>
      <AboutControl />
    </AdminLayout>
  );
}
