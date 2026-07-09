import { View, Text, StyleSheet } from "react-native";

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
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});