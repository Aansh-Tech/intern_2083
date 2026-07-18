import { memo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

interface AdminCommentsHeaderProps {
  pendingCount: number;
}

function AdminCommentsHeader({ pendingCount }: AdminCommentsHeaderProps) {
  const { colors } = useTheme();
  const count = typeof pendingCount === "number" ? pendingCount : 0;

  return (
    <View className="px-5 pt-4">
      <Text className="text-[22px] font-bold" style={{ color: colors.text }}>
        Comments
      </Text>
      <Text className="text-[13px] mt-0.5" style={{ color: colors.secondaryText }}>
        {String(count)} awaiting review
      </Text>
    </View>
  );
}

export default memo(AdminCommentsHeader);