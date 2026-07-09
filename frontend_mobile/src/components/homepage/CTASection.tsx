import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/useTheme";

export default function CTASection() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/(tabs)/project")}
        activeOpacity={0.8}
      >
        <Text style={[styles.primaryText, { color: colors.text }]}>View projects</Text>
        <ArrowRight size={18} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.secondaryButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push("/(tabs)/contact")}
        activeOpacity={0.8}
      >
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
