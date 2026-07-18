import { memo } from "react";
import { View, Text } from "react-native";
import type { CommentStatus } from "../../types/comment";

const colorMap: Record<CommentStatus, string> = {
  pending: "#F59E0B",
  approved: "#10B981",
  spam: "#EF4444",
};

interface StatusBadgeProps {
  status: CommentStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const safeStatus = status ?? "pending";
  const bg = colorMap[safeStatus] + "20";
  const color = colorMap[safeStatus];

  return (
    <View
      className="rounded-full px-3 py-1 self-start"
      style={{ backgroundColor: bg }}
    >
      <Text
        className="text-[11px] font-semibold capitalize"
        style={{ color }}
      >
        {safeStatus}
      </Text>
    </View>
  );
}

export default memo(StatusBadge);