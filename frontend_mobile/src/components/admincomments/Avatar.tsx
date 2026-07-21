import { memo, useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

interface AvatarProps {
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Avatar({ name, size = 44 }: AvatarProps) {
  const { colors } = useTheme();
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <View
      className="rounded-full items-center justify-center"
      style={{ width: size, height: size, backgroundColor: colors.primary }}
    >
      <Text
        className="font-bold"
        style={{ color: colors.text, fontSize: size * 0.38 }}
      >
        {initials}
      </Text>
    </View>
  );
}

export default memo(Avatar);