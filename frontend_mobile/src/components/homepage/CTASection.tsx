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
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/(tabs)/project")}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>View projects</Text>
        <ArrowRight size={18} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondary, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push("/(tabs)/contact")}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>Get in touch</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 999,
    gap: 8,
  },
  secondary: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
