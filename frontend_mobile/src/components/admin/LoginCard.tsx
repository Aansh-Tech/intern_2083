import { View, Text, Platform } from "react-native";
import { Lock } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface LoginCardProps {
  children: React.ReactNode;
}

export default function LoginCard({ children }: LoginCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="w-full max-w-[420px] rounded-[24px] border border-solid px-6 py-6"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        ...(Platform.OS === "ios"
          ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
            }
          : { elevation: 8 }),
      }}
    >
      <View className="flex-row items-center gap-4 w-full mb-6">
        <View
          className="w-14 h-14 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <Lock size={24} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <View className="flex-1">
          <Text className="text-[12px] font-semibold uppercase tracking-[2px] mb-1" style={{ color: colors.primary }}>
            Admin
          </Text>
          <Text className="text-[26px] font-bold" style={{ color: colors.text }}>
            Sign in to the console
          </Text>
        </View>
      </View>

      <Text className="text-[15px] leading-6 mb-7" style={{ color: colors.secondaryText }}>
        Enter your credentials to manage the site.
      </Text>

      <View className="w-full gap-5">{children}</View>
    </View>
  );
}