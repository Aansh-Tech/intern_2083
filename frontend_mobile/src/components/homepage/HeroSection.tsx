import { View, Text, StyleSheet } from "react-native";
import Badge from "./Badge";
import { useTheme } from "../../context/useTheme";

export default function HeroSection() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Badge />
      <Text style={[styles.heading, { color: colors.text }]}>
        Architecting digital{"\n"}experiences.
      </Text>
      <Text style={[styles.description, { color: colors.secondaryText }]}>
        I design and build calm, high-performance interfaces for ambitious
        software teams. Currently focused on developer tools and design systems.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 20,
  },
  heading: {
    fontSize: 52,
    fontWeight: "bold",
    lineHeight: 58,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
  },
});
