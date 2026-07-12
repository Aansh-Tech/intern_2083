import { memo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

interface AdminCommentsHeaderProps {
  pendingCount: number;
}

function AdminCommentsHeader({ pendingCount }: AdminCommentsHeaderProps) {
  const { colors } = useTheme();

  return (
    <View className="px-5 pt-4">
      <Text className="text-[22px] font-bold" style={{ color: colors.text }}>
        Comments
      </Text>
      <Text className="text-[13px] mt-0.5" style={{ color: colors.secondaryText }}>
        {pendingCount} awaiting review
      </Text>
    </View>
  );
}

export default memo(AdminCommentsHeader);
