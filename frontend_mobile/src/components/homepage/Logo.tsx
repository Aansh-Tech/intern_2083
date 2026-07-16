import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/useTheme";
import { useProfile } from "../../context/ProfileContext";

export default function Logo() {
  const { colors } = useTheme();
  const { profile } = useProfile();

  const name = profile.name ?? "";
  const avatarUrl = profile.avatar ?? profile.profile_image ?? null;
  const initials = name
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
        {name || "Anish Shrestha"}
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
