import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/useTheme";

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function SecondaryButton({ title, onPress, disabled = false }: SecondaryButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="rounded-3xl py-3 px-5 items-center justify-center border"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text className="text-sm font-semibold" style={{ color: colors.text }}>{title}</Text>
    </TouchableOpacity>
  );
}