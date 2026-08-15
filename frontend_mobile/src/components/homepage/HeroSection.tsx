import { View, Text, StyleSheet } from "react-native";
import Badge from "./Badge";
import { useTheme } from "../../context/useTheme";
import { useResponsiveFontSize, useResponsiveContainer } from "../../utils/responsive";

export default function HeroSection() {
  const { colors } = useTheme();
  const container = useResponsiveContainer();
  const headingSize = useResponsiveFontSize(52);
  const descriptionSize = useResponsiveFontSize(18);
  const headingLineHeight = Math.round(headingSize * 1.1);
  const descriptionLineHeight = Math.round(descriptionSize * 1.5);

  return (
    <View style={[styles.container, container]}>
      <Badge />
      <Text style={[styles.heading, { color: colors.text, fontSize: headingSize, lineHeight: headingLineHeight }]}>
        Architecting digital{"\n"}experiences.
      </Text>
      <Text style={[styles.description, { color: colors.secondaryText, fontSize: descriptionSize, lineHeight: descriptionLineHeight }]}>
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
    fontWeight: "bold",
  },
  description: {},
});
