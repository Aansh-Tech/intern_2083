import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

export default function CTASection() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
        <Text style={[styles.primaryText, { color: colors.text }]}>View projects</Text>
        <ArrowRight size={18} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.secondaryText, { color: colors.text }]}>Get in touch</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 14,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    height: 58,
    gap: 8,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    height: 58,
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
