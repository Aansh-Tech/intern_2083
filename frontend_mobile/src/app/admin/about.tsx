import { useState, useCallback } from "react";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import AboutControl from "../../components/admin_about/AboutControl";

export default function AdminAboutScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.resolve();
    setRefreshing(false);
  }, []);

  return (
    <AdminLayout>
      <AboutControl refreshing={refreshing} onRefresh={onRefresh} />
    </AdminLayout>
  );
}
