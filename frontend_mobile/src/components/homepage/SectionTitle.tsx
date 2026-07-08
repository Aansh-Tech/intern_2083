import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/useTheme";

export default function SectionTitle() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: colors.primary }]}>SELECTED WORK</Text>
      <Text style={[styles.title, { color: colors.text }]}>Featured projects</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
