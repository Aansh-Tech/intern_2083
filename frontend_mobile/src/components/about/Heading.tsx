import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/useTheme";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

export default function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 4,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});