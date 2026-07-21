import { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowUpRight } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress: () => void;
  badge?: string;
}

function QuickActionCard({ icon: Icon, title, subtitle, onPress, badge }: QuickActionCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="rounded-3xl border p-5 flex-row items-center"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        className="w-[46px] h-[46px] rounded-full items-center justify-center"
        style={{ backgroundColor: colors.primary + "20" }}
      >
        <Icon size={20} color={colors.primary} />
      </View>
      <View className="flex-1 ml-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-[16px] font-bold" style={{ color: colors.text }}>{title}</Text>
          {badge && (
            <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary }}>
              <Text className="text-[11px] font-bold" style={{ color: colors.text }}>{badge}</Text>
            </View>
          )}
        </View>
        <Text className="text-[13px] mt-0.5" style={{ color: colors.secondaryText }}>{subtitle}</Text>
      </View>
      <ArrowUpRight size={18} color={colors.secondaryText} />
    </TouchableOpacity>
  );
}

export default memo(QuickActionCard);
