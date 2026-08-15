import { View, Text } from "react-native";

export type BadgeVariant = "completed" | "featured" | "in-progress";

const variantStyles: Record<
  BadgeVariant,
  { bg: string; text: string; label: string }
> = {
  completed: { bg: "#DDE7FF", text: "#2B3E8C", label: "COMPLETED" },
  featured: { bg: "#E4DCFB", text: "#4C1D95", label: "FEATURED" },
  "in-progress": { bg: "#FCE7F3", text: "#9D174D", label: "IN PROGRESS" },
};

interface StatusBadgeProps {
  variant: BadgeVariant;
}

export default function StatusBadge({ variant }: StatusBadgeProps) {
  const { bg, text, label } = variantStyles[variant];

  return (
    <View
      className="px-2.5 py-1 rounded-full self-start"
      style={{ backgroundColor: bg }}
    >
      <Text
        className="text-[10px] font-bold tracking-[0.5px]"
        style={{ color: text }}
      >
        {label}
      </Text>
    </View>
  );
}