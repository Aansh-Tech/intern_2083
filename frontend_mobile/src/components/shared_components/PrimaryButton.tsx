import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/useTheme";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({ title, onPress, disabled = false }: PrimaryButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="rounded-3xl py-3 px-5 items-center justify-center"
      style={{ backgroundColor: colors.primary }}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text className="text-sm font-semibold" style={{ color: colors.text }}>{title}</Text>
    </TouchableOpacity>
  );
}