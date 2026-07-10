import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/useTheme";

interface StatsCardProps {
  value: string;
  title: string;
}

export default function StatsCard({ value, title }: StatsCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.title, { color: colors.secondaryText }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  value: {
    fontSize: 34,
    fontWeight: "bold",
  },
  title: {
    fontSize: 15,
    marginTop: 4,
  },
});
