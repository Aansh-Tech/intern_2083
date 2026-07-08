import { TouchableOpacity, StyleSheet } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

export default function ThemeButton() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      {isDark ? (
        <Sun size={18} color={colors.secondaryText} />
      ) : (
        <Moon size={18} color={colors.secondaryText} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
