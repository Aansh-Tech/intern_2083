import { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface DashboardStatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  badge?: string;
  badgeColor: string;
  iconBgColor: string;
}

function DashboardStatCard({
  icon: Icon,
  value,
  label,
  badge,
  badgeColor,
  iconBgColor,
}: DashboardStatCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="rounded-3xl border p-5"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
      activeOpacity={0.85}
    >
      <View className="flex-row justify-between items-start">
        <View
          className="w-[44px] h-[44px] rounded-full items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={20} color="#FFFFFF" />
        </View>
        {badge && (
          <View
            className="px-2.5 py-1 rounded-full"
            style={{ backgroundColor: badgeColor + "20" }}
          >
            <Text className="text-[11px] font-bold" style={{ color: badgeColor }}>{badge}</Text>
          </View>
        )}
      </View>
      <Text className="text-[28px] font-bold mt-3" style={{ color: colors.text }}>{value}</Text>
      <Text className="text-[13px] mt-0.5" style={{ color: colors.secondaryText }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default memo(DashboardStatCard);
