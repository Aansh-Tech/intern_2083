import { useState, useCallback } from "react";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import BlogControl from "../../components/admin_blog/BlogControl";

export default function AdminBlogScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.resolve();
    setRefreshing(false);
  }, []);

  return (
    <AdminLayout>
      <BlogControl refreshing={refreshing} onRefresh={onRefresh} />
    </AdminLayout>
  );
}
