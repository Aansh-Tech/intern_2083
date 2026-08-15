import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer, useResponsiveFontSize } from "../../utils/responsive";

export default function PageHeader() {
  const { colors } = useTheme();
  const container = useResponsiveContainer();
  const titleSize = useResponsiveFontSize(38);

  return (
    <View style={[container, { paddingHorizontal: 20, paddingTop: 28, gap: 8 }]}>
      <Text
        className="text-[13px] font-semibold tracking-[2px]"
        style={{ color: colors.primary }}
      >
        PORTFOLIO
      </Text>
      <Text
        className="font-bold"
        style={{ color: colors.text, fontSize: titleSize, lineHeight: Math.round(titleSize * 1.1) }}
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