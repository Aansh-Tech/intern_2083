import { memo, useCallback } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "../../context/useTheme";

interface PercentageSliderProps {
  value: number;
  onChange: (value: number) => void;
}

function PercentageSlider({ value, onChange }: PercentageSliderProps) {
  const { colors } = useTheme();

  return (
    <View className="gap-2">
      <View className="flex-row justify-between items-center">
        <Text
          className="text-[13px] font-semibold uppercase tracking-[0.8px]"
          style={{ color: colors.secondaryText }}
        >
          Proficiency
        </Text>
        <Text className="text-[15px] font-bold" style={{ color: colors.primary }}>
          {Math.round(value)}%
        </Text>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
        style={{ height: 40 }}
      />
    </View>
  );
}

export default memo(PercentageSlider);
