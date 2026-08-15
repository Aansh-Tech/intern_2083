import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

export default function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();

  return (
    <View style={[container, { paddingHorizontal: 20, paddingTop: 40, gap: 4 }]}>
      <Text className="text-[13px] font-semibold tracking-[2px]" style={{ color: colors.primary }}>
        {eyebrow}
      </Text>
      <Text className="text-[28px] font-bold" style={{ color: colors.text }}>
        {title}
      </Text>
    </View>
  );
}