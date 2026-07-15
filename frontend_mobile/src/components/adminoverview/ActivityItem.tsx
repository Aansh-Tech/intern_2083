import { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/useTheme";

interface ActivityItemProps {
  title: string;
  subtitle: string;
  isLast?: boolean;
  onPress?: () => void;
}

function ActivityItem({ title, subtitle, isLast, onPress }: ActivityItemProps) {
  const { colors } = useTheme();

  const content = (
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

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <>{content}</>;
}

export default memo(ActivityItem);
