import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal as RNModal,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Check, X, Info, TriangleAlert } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import type { ModalState, PopupType } from "./popupTypes";

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

function modalKey(modal: ModalState): string {
  if (modal.kind === "dialog") {
    return `dialog|${modal.type}|${modal.title}|${modal.message ?? ""}|${modal.primaryText ?? ""}`;
  }
  return `confirm|${modal.title}|${modal.message ?? ""}|${modal.confirmText ?? ""}|${modal.destructive ?? false}`;
}

interface AppModalProps {
  modal: ModalState | null;
  onDismiss: () => void;
}

export default function AppModal({ modal, onDismiss }: AppModalProps) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const modalWidth = Math.min(windowWidth - 48, 400);
  const [visible, setVisible] = useState(false);
  const [internal, setInternal] = useState<ModalState | null>(null);
  const visibleRef = useRef(false);
  const closingRef = useRef(false);
  const keyRef = useRef<string | null>(null);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.95)).current;

  const animateIn = useCallback(() => {
    backdropOpacity.setValue(0);
    contentOpacity.setValue(0);
    contentScale.setValue(0.95);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(contentScale, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [backdropOpacity, contentOpacity, contentScale]);

  const animateOut = useCallback(
    (done: () => void) => {
      if (closingRef.current) return;
      closingRef.current = true;
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(contentOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(contentScale, { toValue: 0.96, duration: 160, useNativeDriver: true }),
      ]).start(() => {
        closingRef.current = false;
        setInternal(null);
        setVisible(false);
        visibleRef.current = false;
        keyRef.current = null;
        done();
      });
    },
    [backdropOpacity, contentOpacity, contentScale]
  );

  useEffect(() => {
    if (!modal) {
      if (keyRef.current !== null) {
        animateOut(() => {});
      }
      return;
    }
    const key = modalKey(modal);
    if (keyRef.current === key) return;
    keyRef.current = key;
    setInternal(modal);
    if (visibleRef.current) {
      animateIn();
    } else {
      setVisible(true);
    }
  }, [modal, animateIn, animateOut]);

  const dismiss = useCallback(
    (runAction?: () => void | Promise<void>) => {
      animateOut(() => {
        onDismiss();
        if (runAction) {
          Promise.resolve(runAction()).catch(() => {});
        }
      });
    },
    [animateOut, onDismiss]
  );

  if (!internal) return null;

  const isConfirm = internal.kind === "confirm";
  const type = isConfirm ? (internal.destructive ? "error" : "warning") : internal.type;
  const accent = ACCENTS[type];
  const Icon = ICONS[type];
  const canBackdropDismiss = isConfirm
    ? internal.allowBackdropDismiss === true
    : internal.allowBackdropDismiss !== false;
  const primaryText = isConfirm
    ? internal.confirmText ?? (internal.destructive ? "Delete" : "Confirm")
    : internal.primaryText ?? "OK";
  const secondaryText = isConfirm ? internal.cancelText ?? "Cancel" : internal.secondaryText;
  const destructive = isConfirm ? !!internal.destructive : false;
  const primaryBg = destructive ? "#EF4444" : colors.primary;
  const primaryFg = destructive ? "#FFFFFF" : colors.text;

  const handlePrimary = () => {
    const action = isConfirm ? internal.onConfirm : internal.onPrimary;
    dismiss(action);
  };

  const handleSecondary = () => {
    const action = isConfirm ? internal.onCancel : internal.onSecondary;
    dismiss(action);
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent={Platform.OS === "android"}
      onRequestClose={handleSecondary}
      onShow={animateIn}
    >
      <Animated.View
        className="flex-1 items-center justify-center px-8"
        style={[{ backgroundColor: "rgba(0,0,0,0.55)", opacity: backdropOpacity }]}
        accessibilityViewIsModal
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => canBackdropDismiss && dismiss()}
          accessibilityLabel="Dismiss dialog"
          accessibilityRole="button"
        />

        <Animated.View
          className="w-full rounded-[24px] border items-center px-6 pb-6 pt-7"
          style={{
            width: modalWidth,
            maxWidth: modalWidth,
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: contentOpacity,
            transform: [{ scale: contentScale }],
            shadowColor: "#000000",
            shadowOpacity: 0.35,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
            elevation: 24,
          }}
          accessibilityRole="alert"
        >
          <View
            className="w-[56px] h-[56px] rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: `${accent}1A` }}
          >
            <Icon size={26} color={accent} strokeWidth={2.4} />
          </View>

          <Text
            className="text-[19px] font-bold text-center"
            style={{ color: colors.text }}
          >
            {internal.title}
          </Text>

          {internal.message ? (
            <Text
              className="text-[14px] leading-[20px] text-center mt-2"
              style={{ color: colors.secondaryText }}
            >
              {internal.message}
            </Text>
          ) : null}

          {secondaryText ? (
            <View className="flex-row gap-3 mt-6 w-full">
              <TouchableOpacity
                className="flex-1 h-[52px] rounded-full border items-center justify-center"
                style={{ borderColor: colors.border }}
                onPress={handleSecondary}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={secondaryText}
              >
                <Text className="text-[15px] font-semibold" style={{ color: colors.secondaryText }}>
                  {secondaryText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 h-[52px] rounded-full items-center justify-center"
                style={{ backgroundColor: primaryBg }}
                onPress={handlePrimary}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={primaryText}
              >
                <Text className="text-[15px] font-bold" style={{ color: primaryFg }}>
                  {primaryText}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="w-full h-[52px] rounded-full items-center justify-center mt-6"
              style={{ backgroundColor: primaryBg }}
              onPress={handlePrimary}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={primaryText}
            >
              <Text className="text-[15px] font-bold" style={{ color: primaryFg }}>
                {primaryText}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
}