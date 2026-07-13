import { View, Text } from "react-native";

export type BadgeVariant = "completed" | "featured" | "in-progress";

const variantStyles: Record<
  BadgeVariant,
  { bg: string; text: string; label: string }
> = {
  completed: { bg: "#E0E7FF", text: "#3730A3", label: "COMPLETED" },
  featured: { bg: "#DDD6FE", text: "#5B21B6", label: "FEATURED" },
  "in-progress": { bg: "#FCE7F3", text: "#9D174D", label: "IN PROGRESS" },
};

interface StatusBadgeProps {
  variant: BadgeVariant;
}

export default function StatusBadge({ variant }: StatusBadgeProps) {
  const { bg, text, label } = variantStyles[variant];

  return (
    <View
      className="px-3 py-[5px] rounded-full self-start"
      style={{ backgroundColor: bg }}
    >
      <Text
        className="text-[11px] font-bold tracking-[0.5px]"
        style={{ color: text }}
      >
        {label}
      </Text>
    </View>
  );
}