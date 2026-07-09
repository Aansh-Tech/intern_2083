import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../context/useTheme";

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

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => {
        const isActive = active === filter.value;

        return (
          <TouchableOpacity
            key={filter.value}
            onPress={() => onChange(filter.value)}
            activeOpacity={0.7}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.text : colors.secondaryText },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 10,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});