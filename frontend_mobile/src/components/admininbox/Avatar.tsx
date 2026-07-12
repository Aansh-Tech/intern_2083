import { memo, useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/useTheme";

interface AvatarProps {
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
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
