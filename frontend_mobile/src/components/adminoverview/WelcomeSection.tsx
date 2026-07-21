import { memo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

function WelcomeSection() {
  const { colors } = useTheme();

  return (
    <View className="px-5 pb-2">
      <Text className="text-[11px] font-semibold tracking-[1.5px]" style={{ color: colors.primary }}>
        WELCOME BACK
      </Text>
      <Text className="text-[28px] font-bold mt-1" style={{ color: colors.text }}>Overview</Text>
      <Text className="text-[15px] mt-1" style={{ color: colors.secondaryText }}>
        A quick snapshot of your portfolio activity.
      </Text>
    </View>
  );
}

export default memo(WelcomeSection);
