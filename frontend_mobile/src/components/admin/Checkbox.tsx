import { useRef, useEffect } from "react";
import { TouchableOpacity, Text, Animated, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export default function Checkbox({ label, checked, onToggle }: CheckboxProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  }, [checked, scaleAnim]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? colors.primary : colors.border,
            backgroundColor: checked ? colors.primary : "transparent",
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View style={{ opacity: scaleAnim }}>
          <Check size={14} color="#FFFFFF" strokeWidth={3} />
        </Animated.View>
      </Animated.View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 24,
    columnGap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
  },
});