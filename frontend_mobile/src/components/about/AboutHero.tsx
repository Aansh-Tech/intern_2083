import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/useTheme";

const profile = {
  name: "Anish Shrestha",
  role: "Senior Developer & Designer",
  bio: [
    "I design and build calm, high-performance interfaces for ambitious software teams. Over the last decade I've partnered with early-stage founders and public companies to ship developer tools, design systems, and analytics interfaces.",
    "Outside of client work I write about interface design, keep a small library of open-source utilities, and take long walks with a notebook.",
  ],
  resumeUrl: "https://example.com/Anish-Shrestha-resume.pdf",
};

const socialLinks = [
  { key: "github", iconName: "logo-github", url: "https://github.com/aneez11" },
  { key: "linkedin", iconName: "logo-linkedin", url: "https://www.linkedin.com/in/anish-shrestha-4ba524122/" },
  { key: "twitter", iconName: "logo-twitter", url: "https://twitter.com/" },
  { key: "instagram", iconName: "logo-instagram", url: "https://www.instagram.com/aneez_st" },
  { key: "mail", iconName: "mail-outline", url: "mailto:shresthaanish51@gmail.com" },
] as const; 

export default function AboutHero() {
  const { colors } = useTheme();
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>ABOUT</Text>

      <View style={styles.identity}>
        <LinearGradient
          colors={["#A855F7", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>

        <View style={styles.identityText}>
          <Text style={[styles.name, { color: colors.text }]}>
            {profile.name}
          </Text>
          <Text style={[styles.role, { color: colors.secondaryText }]}>
            {profile.role}
          </Text>
        </View>
      </View>

      {profile.bio.map((paragraph, i) => (
        <Text key={i} style={[styles.bio, { color: colors.secondaryText }]}>
          {paragraph}
        </Text>
      ))}

      <TouchableOpacity
        style={[styles.resumeButton, { backgroundColor: colors.primary }]}
        activeOpacity={0.85}
        onPress={() => openLink(profile.resumeUrl)}
      >
        <Ionicons name="download-outline" size={18} color={colors.text} />
        <Text style={[styles.resumeText, { color: colors.text }]}>
          Download résumé
        </Text>
      </TouchableOpacity>

      <View style={styles.socialRow}>
        {socialLinks.map(({ key, iconName, url }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.socialCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            activeOpacity={0.7}
            onPress={() => openLink(url)}
          >
            <Ionicons name={iconName} size={20} color={colors.secondaryText} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 16,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  identityText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
  },
  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    borderRadius: 16,
    marginTop: 4,
  },
  resumeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  socialCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});