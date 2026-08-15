import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, X, Info, TriangleAlert } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import type { ToastState, PopupType } from "./popupTypes";

const ACCENTS: Record<PopupType, string> = {
  success: "#22C55E",
  error: "#EF4444",
  info: "#3B82F6",
  warning: "#F59E0B",
};

const ICONS: Record<PopupType, React.ComponentType<{ size: number; color: string; strokeWidth?: number }>> = {
  success: Check,
  error: X,
  info: Info,
  warning: TriangleAlert,
};

const TAB_BAR_CLEARANCE = 84;

function ToastItem({ toast, onDismiss }: { toast: ToastState; onDismiss: (id: string) => void }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const Icon = ICONS[toast.type];
  const accent = ACCENTS[toast.type];
  const filled = toast.variant === "filled";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(translateY, { toValue: 0, duration: 260, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 12, duration: 200, useNativeDriver: true }),
      ]).start(() => onDismiss(toast.id));
    }, toast.duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.toast,
        filled
          ? {
              backgroundColor: accent,
              borderColor: accent,
              alignSelf: "center",
              width: "100%",
              maxWidth: 380,
              borderRadius: 16,
              shadowColor: "#000000",
              shadowOpacity: 0.25,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 8 },
              elevation: 12,
            }
          : {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: "#000000",
              shadowOpacity: 0.3,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 12,
            },
        { opacity, transform: [{ translateY }] },
      ]}
      accessibilityRole="alert"
    >
      <TouchableOpacity
        style={filled ? styles.toastInnerFilled : styles.toastInner}
        onPress={() => onDismiss(toast.id)}
        activeOpacity={0.9}
        accessibilityLabel={toast.message}
        accessibilityRole="button"
      >
        {!filled && (
          <View
            style={[styles.iconWrap, { backgroundColor: `${accent}1A` }]}
          >
            <Icon size={16} color={accent} strokeWidth={2.5} />
          </View>
        )}
        <Text
          style={[
            filled ? styles.messageFilled : styles.message,
            { color: filled ? "#FFFFFF" : colors.text },
          ]}
          numberOfLines={2}
        >
          {toast.message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface AppToastProps {
  toasts: ToastState[];
  onDismiss: (id: string) => void;
}

export default function AppToast({ toasts, onDismiss }: AppToastProps) {
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { bottom: insets.bottom + TAB_BAR_CLEARANCE }]}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    gap: 8,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  toastInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  toastInnerFilled: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  messageFilled: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});