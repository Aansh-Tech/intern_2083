import { memo } from "react";
import { Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

export type FilterValue = "all" | "pending" | "approved" | "spam";

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
  const container = useResponsiveContainer();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[container]}
      contentContainerStyle={{ flexDirection: "row", paddingHorizontal: 20, gap: 8, flexGrow: 1 }}
    >
      {filters.map((f) => {
        const isActive = value === f.value;
        return (
          <TouchableOpacity
            key={f.value}
            className="h-[36px] rounded-full px-4 items-center justify-center"
            style={[
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderWidth: isActive ? 0 : 1,
                borderColor: colors.border,
              },
              styles.tab,
            ]}
            onPress={() => onChange(f.value)}
            activeOpacity={0.7}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{ color: isActive ? colors.text : colors.secondaryText }}
              numberOfLines={1}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tab: {
    flexGrow: 1,
    flexShrink: 0,
  },
});

export default memo(FilterTabs);