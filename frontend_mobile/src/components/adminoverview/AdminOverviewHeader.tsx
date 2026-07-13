import { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LogOut, Sun, Moon } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface AdminOverviewHeaderProps {
  onSignOut: () => void;
}

function AdminOverviewHeader({ onSignOut }: AdminOverviewHeaderProps) {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-5 pt-2">
      <View className="flex-row items-center gap-4">
        <View
          className="w-[52px] h-[52px] rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-[22px] font-bold" style={{ color: colors.text }}>A</Text>
        </View>
        <View className="gap-0.5">
          <Text className="text-[11px] font-semibold tracking-[1.5px]" style={{ color: colors.primary }}>
            ADMIN
          </Text>
          <Text className="text-[26px] font-bold" style={{ color: colors.text }}>Console</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          className="w-[36px] h-[36px] rounded-full items-center justify-center border"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun size={18} color={colors.secondaryText} />
          ) : (
            <Moon size={18} color={colors.secondaryText} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center h-[42px] rounded-full border px-5 gap-2"
          style={{ borderColor: colors.border }}
          onPress={onSignOut}
          activeOpacity={0.7}
        >
          <LogOut size={16} color={colors.secondaryText} />
          <Text className="text-[14px] font-medium" style={{ color: colors.secondaryText }}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(AdminOverviewHeader);
