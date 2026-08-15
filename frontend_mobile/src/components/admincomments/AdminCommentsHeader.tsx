import { memo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

interface AdminCommentsHeaderProps {
  pendingCount: number;
}

function AdminCommentsHeader({ pendingCount }: AdminCommentsHeaderProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();
  const count = typeof pendingCount === "number" ? pendingCount : 0;

  return (
    <View style={[container, { paddingHorizontal: 20, paddingTop: 16 }]}>
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