import { memo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

interface ActivityItemProps {
  title: string;
  subtitle: string;
  isLast?: boolean;
}

function ActivityItem({ title, subtitle, isLast }: ActivityItemProps) {
  const { colors } = useTheme();

  return (
    <>
      <View className="flex-row items-start gap-3 py-4">
        <View
          className="w-[10px] h-[10px] rounded-full mt-1"
          style={{ backgroundColor: colors.primary }}
        />
        <View className="flex-1">
          <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>{title}</Text>
          <Text className="text-[13px] mt-0.5" style={{ color: colors.secondaryText }}>{subtitle}</Text>
        </View>
      </View>
      {!isLast && (
        <View className="h-[1px]" style={{ backgroundColor: colors.border }} />
      )}
    </>
  );
}

export default memo(ActivityItem);
