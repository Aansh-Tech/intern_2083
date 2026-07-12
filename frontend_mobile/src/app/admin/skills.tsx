import { View, Text } from "react-native";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import { useTheme } from "../../context/useTheme";

export default function AdminSkillsScreen() {
  const { colors } = useTheme();

  return (
    <AdminLayout>
      <View className="px-5 pt-4">
        <Text className="text-[22px] font-bold" style={{ color: colors.text }}>Skills</Text>
        <Text className="text-[15px] mt-1" style={{ color: colors.secondaryText }}>
          Update your skill set and proficiency levels.
        </Text>
      </View>
    </AdminLayout>
  );
}
