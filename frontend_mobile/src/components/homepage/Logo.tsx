import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/useTheme";
import { useProfile } from "../../context/ProfileContext";
import { resolveImageUrl } from "../../services/image";

export default function Logo() {
  const { colors } = useTheme();
  const { profile, photoTimestamp } = useProfile();

  const displayName = profile.name ?? "Anish Shrestha";
  const rawUrl = profile.avatar ?? profile.profile_image ?? profile.profile_photo ?? null;
  const resolvedUrl = rawUrl
    ? rawUrl.startsWith("http")
      ? rawUrl
      : resolveImageUrl(rawUrl)
    : null;
  const avatarUrl = resolvedUrl
    ? `${resolvedUrl}${resolvedUrl.includes("?") ? "&" : "?"}t=${photoTimestamp}`
    : null;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.row}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : initials ? (
        <LinearGradient
          colors={["#A855F7", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.initials}>{initials}</Text>
        </LinearGradient>
      ) : null}
      <Text style={[styles.logo, { color: colors.text }]}>
        {displayName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  logo: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },
});