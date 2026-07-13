import { View, Text } from "react-native";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import { useTheme } from "../../context/useTheme";
import AboutControl from "../../components/admin_about/AboutControl";

export default function AdminAboutScreen() {
  const { colors } = useTheme();
  const activeTab = "about";

  return (
    <AdminLayout>
      {activeTab === "about" && <AboutControl />}
      {/* <View className="px-5 pt-4">
        <Text className="text-[22px] font-bold" style={{ color: colors.text }}>About</Text>
        <Text className="text-[15px] mt-1" style={{ color: colors.secondaryText }}>
          Manage your about page content and bio.
        </Text>
      </View> */}
    </AdminLayout>
  );
}
