import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

export default function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  const { colors } = useTheme();

  return (
    <View className="px-5 pt-10 gap-1">
      <Text className="text-[13px] font-semibold tracking-[2px]" style={{ color: colors.primary }}>
        {eyebrow}
      </Text>
      <Text className="text-[28px] font-bold" style={{ color: colors.text }}>
        {title}
      </Text>
    </View>
  );
}