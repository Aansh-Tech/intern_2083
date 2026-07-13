import { View, Text } from "react-native";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import { useTheme } from "../../context/useTheme";
import BlogControl from "../../components/admin_blog/BlogControl";

export default function AdminBlogScreen() {
  const { colors } = useTheme();

  return (
    <AdminLayout>
      <BlogControl />
    
      {/* <View className="px-5 pt-4">
        <Text className="text-[22px] font-bold" style={{ color: colors.text }}>Blog</Text>
        <Text className="text-[15px] mt-1" style={{ color: colors.secondaryText }}>
          Write and manage your blog posts.
        </Text>
      </View> */}
    </AdminLayout>
  );
}
