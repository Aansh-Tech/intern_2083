import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/useTheme";

export default function Badge() {
  const { colors } = useTheme();

  return (
    <View style={[styles.badge, { borderColor: colors.primary }]}>
      <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      <Text style={[styles.text, { color: colors.primary }]}>Available for new projects</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
  },
});
