import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

interface SectionTitleProps {
  subtitle?: string;
  title?: string;
}

export default function SectionTitle({ subtitle, title }: SectionTitleProps) {
  const { colors } = useTheme();

  return (
    <View className="px-5 gap-1">
      {subtitle && (
        <Text className="text-[13px] font-semibold tracking-[2px]" style={{ color: colors.primary }}>
          {subtitle}
        </Text>
      )}
      {title && (
        <Text className="text-[28px] font-bold" style={{ color: colors.text }}>{title}</Text>
      )}
    </View>
  );
}