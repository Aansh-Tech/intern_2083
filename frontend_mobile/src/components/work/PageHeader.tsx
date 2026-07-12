import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

export default function PageHeader() {
  const { colors } = useTheme();

  return (
    <View className="px-5 pt-7 gap-2">
      <Text
        className="text-[13px] font-semibold tracking-[2px]"
        style={{ color: colors.primary }}
      >
        PORTFOLIO
      </Text>
      <Text
        className="text-[38px] font-bold"
        style={{ color: colors.text }}
      >
        Projects
      </Text>
      <Text
        className="text-base leading-[23px] mt-1"
        style={{ color: colors.secondaryText }}
      >
        A curated selection of engineering and design work — each shipped in
        production and each representing a real problem I cared about.
      </Text>
    </View>
  );
}