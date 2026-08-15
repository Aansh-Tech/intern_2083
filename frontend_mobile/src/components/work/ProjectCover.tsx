import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FolderKanban } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface ProjectCoverProps {
  gradient: [string, string];
  category?: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Restrained, designed media fallback for projects without an image.
 *
 * Compact: used inside project cards — a subtle theme-based surface (card
 * background + a low-opacity tint of the project's own gradient + a small
 * muted icon/label). Never a solid bright block, so it belongs to the design
 * in both dark and light themes and never competes with the status badges.
 *
 * Hero: used on the project detail page where there is room for the icon
 * chip and category.
 */
const withAlpha = (hex: string, alpha: number): string => {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${clean}${a}`;
};

export default function ProjectCover({
  gradient,
  category,
  compact = false,
  style,
}: ProjectCoverProps) {
  const { colors } = useTheme();
  const tint = withAlpha(gradient[0] ?? colors.primary, compact ? 0.28 : 0.4);

  return (
    <View style={[styles.base, { backgroundColor: colors.card }, style]}>
      <LinearGradient
        colors={[tint, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.watermark} pointerEvents="none">
        <FolderKanban
          size={compact ? 96 : 150}
          color={colors.primary}
          strokeWidth={1.5}
        />
      </View>

      {compact ? (
        <View style={styles.compactContent} pointerEvents="none">
          <View style={[styles.iconChip, styles.iconChipCompact]}>
            <FolderKanban size={20} color={colors.primary} strokeWidth={2} />
          </View>
          <Text
            style={[styles.label, { color: colors.secondaryText }]}
            numberOfLines={1}
          >
            PROJECT
          </Text>
        </View>
      ) : (
        <View style={styles.content} pointerEvents="none">
          <View style={[styles.iconChip, { backgroundColor: colors.primary + "1F" }]}>
            <FolderKanban size={26} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={[styles.label, styles.contentLabel, { color: colors.secondaryText }]}>
            PROJECT
          </Text>
          {category ? (
            <Text
              style={[styles.category, { color: colors.secondaryText }]}
              numberOfLines={1}
            >
              {category}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
  watermark: {
    position: "absolute",
    right: -18,
    bottom: -24,
    opacity: 0.1,
  },
  compactContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconChipCompact: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(139,131,255,0.12)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    opacity: 0.7,
  },
  contentLabel: {
    marginTop: 10,
    fontSize: 12,
    letterSpacing: 3,
  },
  category: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.55,
  },
});