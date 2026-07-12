import { memo } from "react";
import { View, Text } from "react-native";
import { Inbox } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

function EmptyInbox() {
  const { colors } = useTheme();

  return (
    <View className="items-center justify-center px-10 pt-16 pb-20">
      <Inbox size={48} color={colors.secondaryText} />
      <Text className="text-[20px] font-bold mt-4" style={{ color: colors.text }}>
        No messages yet
      </Text>
      <Text className="text-[14px] text-center mt-2" style={{ color: colors.secondaryText }}>
        Messages from the Contact page will appear here.
      </Text>
    </View>
  );
}

export default memo(EmptyInbox);
