import { TouchableOpacity, StyleSheet } from "react-native";
import { Shield } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/useTheme";

export default function AdminButton() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => router.push("/admin")}
      activeOpacity={0.7}
    >
      <Shield size={18} color={colors.secondaryText} />
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
