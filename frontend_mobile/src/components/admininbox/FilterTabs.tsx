import { memo, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

type FilterValue = "all" | "new" | "read";

interface FilterTabsProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const filters: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
];

function FilterTabs({ value, onChange }: FilterTabsProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();

  return (
    <View style={[container, { flexDirection: "row", paddingHorizontal: 20, gap: 8 }]}>
      {filters.map((f) => {
        const isActive = value === f.value;
        return (
          <TouchableOpacity
            key={f.value}
            className="h-[36px] rounded-full px-4 items-center justify-center"
            style={{
              backgroundColor: isActive ? colors.primary : colors.card,
              borderWidth: isActive ? 0 : 1,
              borderColor: colors.border,
            }}
            onPress={() => onChange(f.value)}
            activeOpacity={0.7}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{ color: isActive ? colors.text : colors.secondaryText }}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export type { FilterValue };
export default memo(FilterTabs);
