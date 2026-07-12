import { memo } from "react";
import { View, Text } from "react-native";
import { MessageSquare } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

function EmptyComments() {
  const { colors } = useTheme();

  return (
    <View className="items-center justify-center px-10 pt-16 pb-20">
      <MessageSquare size={48} color={colors.secondaryText} />
      <Text className="text-[20px] font-bold mt-4" style={{ color: colors.text }}>
        No comments yet
      </Text>
      <Text className="text-[14px] text-center mt-2" style={{ color: colors.secondaryText }}>
        Comments submitted on blog posts will appear here.
      </Text>
    </View>
  );
}

export default memo(EmptyComments);
