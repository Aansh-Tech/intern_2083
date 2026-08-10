import { Stack } from "expo-router";
import { useTheme } from "../../context/useTheme";

export default function ResetLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
        animationDuration: 200,
        gestureEnabled: true,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="sent" />
      <Stack.Screen name="change" />
      <Stack.Screen name="success" />
    </Stack>
  );
}