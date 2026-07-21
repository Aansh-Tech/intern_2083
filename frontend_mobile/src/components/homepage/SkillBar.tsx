import { memo, useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { useTheme } from "../../context/useTheme";

interface SkillBarProps {
  name: string;
  percentage: number;
}

function SkillBar({ name, percentage }: SkillBarProps) {
  const { colors } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [animatedWidth, percentage]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="gap-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>{name}</Text>
        <Text className="text-sm font-medium" style={{ color: colors.secondaryText }}>{percentage}%</Text>
      </View>
      <View className="h-2 rounded overflow-hidden" style={{ backgroundColor: colors.border }}>
        <Animated.View
          className="h-full rounded"
          style={[{ width: widthInterpolated, backgroundColor: colors.primary }]}
        />
      </View>
    </View>
  );
}

export default memo(SkillBar);