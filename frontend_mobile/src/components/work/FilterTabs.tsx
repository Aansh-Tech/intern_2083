import { Text, TouchableOpacity, ScrollView, View } from "react-native";
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
      className="flex-grow-0"
    >
      <View className="flex-row px-5 pt-6 gap-2.5">
        {filters.map((filter) => {
          const isActive = active === filter.value;

          return (
            <TouchableOpacity
              key={filter.value}
              onPress={() => onChange(filter.value)}
              activeOpacity={0.7}
              className="px-[18px] py-2.5 rounded-full border"
              style={{
                backgroundColor: isActive ? colors.primary : colors.card,
                borderColor: isActive ? colors.primary : colors.border,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: isActive ? colors.text : colors.secondaryText }}
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