import { memo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

interface InboxHeaderProps {
  unreadCount: number;
}

function InboxHeader({ unreadCount }: InboxHeaderProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();

  return (
    <View style={[container, { paddingHorizontal: 20, paddingTop: 16 }]}>
      <Text className="text-[11px] font-semibold tracking-[1.5px]" style={{ color: colors.primary }}>
        CONTACT
      </Text>
      <Text className="text-[22px] font-bold mt-1" style={{ color: colors.text }}>
        Inbox ({unreadCount})
      </Text>
      <Text className="text-[13px] mt-0.5" style={{ color: colors.secondaryText }}>
        Messages sent through the public contact form.
      </Text>
    </View>
  );
}

export default memo(InboxHeader);
