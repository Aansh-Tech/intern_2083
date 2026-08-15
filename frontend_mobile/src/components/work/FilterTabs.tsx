import { Text, TouchableOpacity, ScrollView, View, StyleSheet } from "react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

export type FilterValue = "all" | "featured" | "completed" | "in-progress";

const filters: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Featured", value: "featured" },
  { label: "Completed", value: "completed" },
  { label: "In Progress", value: "in-progress" },
];

interface FilterTabsProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={[styles.content, container]}
    >
      <View className="flex-row gap-1.5">
        {filters.map((filter) => {
          const isActive = active === filter.value;

          return (
            <TouchableOpacity
              key={filter.value}
              onPress={() => onChange(filter.value)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 999,
                backgroundColor: isActive ? colors.primary + "1F" : "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? colors.primary : colors.secondaryText,
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
});