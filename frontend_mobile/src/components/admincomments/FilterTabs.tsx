import { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/useTheme";

type FilterValue = "all" | "pending" | "approved" | "spam";

interface FilterTabsProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const filters: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Spam", value: "spam" },
];

function FilterTabs({ value, onChange }: FilterTabsProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row px-5 gap-2">
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
