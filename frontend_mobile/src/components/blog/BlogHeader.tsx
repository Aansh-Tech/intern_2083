import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

export default function JournalHeader() {
  const { colors } = useTheme();

  return (
    <View className="px-5 pt-7 gap-2">
      <Text
        className="text-[13px] font-semibold tracking-[2px]"
        style={{ color: colors.primary }}
      >
        JOURNAL
      </Text>
      <Text
        className="text-[38px] font-bold"
        style={{ color: colors.text }}
      >
        Writing
      </Text>
      <Text
        className="text-base leading-[22px] mt-0.5"
        style={{ color: colors.secondaryText }}
      >
        Notes, working sketches, and the occasional strong opinion on
        interface craft.
      </Text>
    </View>
  );
}