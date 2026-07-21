import { TouchableOpacity, Text } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/useTheme";

export default function AdminHeader() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row items-center gap-[5px] h-12 px-4 rounded-full border self-start"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
      onPress={() => router.back()}
      activeOpacity={0.7}
    >
      <ArrowLeft size={18} color={colors.secondaryText} />
      <Text className="text-[15px] font-medium" style={{ color: colors.secondaryText }}>Back to site</Text>
    </TouchableOpacity>
  );
}