import { View, StyleSheet } from "react-native";
import Logo from "./Logo";
import ThemeButton from "./ThemeButton";
import AdminButton from "./AdminButton";
import { useTheme } from "../../context/useTheme";

export default function Header() {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.header, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
      <Logo />
      <View style={styles.actions}>
        <ThemeButton />
        <AdminButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
});
