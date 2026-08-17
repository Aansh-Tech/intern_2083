import { ReactNode } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/useTheme";
import { isTablet } from "../../utils/responsive";

interface AppSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxHeight?: number | `${number}%`;
  dismissable?: boolean;
}

/**
 * Shared floating bottom-sheet modal used by every form / detail popup.
 * Renders a full-screen dimmed backdrop with an elevated, rounded sheet on top,
 * plus a grabber handle, a header with an optional title and a close button,
 * a scrollable body and an optional fixed footer.
 */
export default function AppSheet({
  visible,
  onClose,
  title,
  children,
  footer,
  maxHeight,
  dismissable = true,
}: AppSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const sheetMaxHeight =
    maxHeight == null
      ? Math.round(windowHeight * 0.88)
      : typeof maxHeight === "number"
        ? maxHeight
        : Math.round(windowHeight * (parseFloat(maxHeight) / 100));

  const tablet = isTablet(windowWidth);
  const sheetTabletStyle = tablet
    ? {
        alignSelf: "center",
        width: Math.min(windowWidth - 48, 720),
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        marginBottom: 24,
      }
    : null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={[styles.flex, { backgroundColor: "rgba(0,0,0,0.6)" }]}
          onPress={() => {
            if (dismissable) onClose();
          }}
        >
          <View style={styles.sheetAnchor}>
            <Pressable onPress={() => {}}>
              <View
                style={[
                  styles.sheetShadow,
                  tablet && styles.sheetTablet,
                  sheetTabletStyle,
                  {
                    backgroundColor: colors.card,
                    shadowColor: "#000000",
                    shadowOpacity: 0.35,
                    shadowRadius: 24,
                    shadowOffset: { width: 0, height: -8 },
                    elevation: 24,
                  },
                ]}
              >
                <View
                  style={[
                    styles.sheet,
                    {
                      backgroundColor: colors.card,
                      maxHeight: sheetMaxHeight,
                      paddingBottom: insets.bottom + 8,
                    },
                  ]}
                >
                  <View style={styles.grabberWrap}>
                    <View style={[styles.grabber, { backgroundColor: colors.border }]} />
                  </View>

                  <View style={styles.header}>
                    {title ? (
                      <Text
                        style={[styles.title, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {title}
                      </Text>
                    ) : (
                      <View style={styles.flex} />
                    )}
                    <TouchableOpacity
                      style={[styles.closeBtn, { backgroundColor: colors.background }]}
                      onPress={onClose}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel="Close"
                    >
                      <X size={18} color={colors.secondaryText} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.body}
                  >
                    {children}
                  </ScrollView>

                  {footer ? (
                    <View style={[styles.footer, { borderTopColor: colors.border }]}>
                      {footer}
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  sheetAnchor: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetShadow: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetTablet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  grabberWrap: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 2,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 12,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
});