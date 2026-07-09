import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/useTheme";

export default function PageHeader() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>
        PORTFOLIO
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>Projects</Text>
      <Text style={[styles.description, { color: colors.secondaryText }]}>
        A curated selection of engineering and design work — each shipped in
        production and each representing a real problem I cared about.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 8,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 4,
  },
});