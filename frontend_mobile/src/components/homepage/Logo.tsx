import { Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/useTheme";

export default function Logo() {
  const { colors } = useTheme();

  return <Text style={[styles.logo, { color: colors.text }]}>Anish Shrestha</Text>;
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
