import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/useTheme";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}

export default function AppButton({ title, onPress, disabled = false, style }: AppButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={style}>
      <Text style={{ color: colors.text, textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
