import { View, Text, TouchableOpacity, Linking } from "react-native";
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
  { key: "facebook", iconName: "logo-facebook", url: "https://www.facebook.com/shresthaanish51" },
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
    <View className="px-5 pt-7 gap-4">
      {/* Eyebrow */}
      <Text className="text-[13px] font-semibold tracking-[2px]" style={{ color: colors.primary }}>
        ABOUT
      </Text>

      {/* Identity */}
      <View className="flex-row items-center gap-4">
        <LinearGradient
          colors={["#A855F7", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-16 h-16 rounded-full items-center justify-center"
        >
          <Text className="text-[22px] font-bold text-white">{initials}</Text>
        </LinearGradient>

        <View className="flex-1 gap-0.5">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            {profile.name}
          </Text>
          <Text className="text-sm" style={{ color: colors.secondaryText }}>
            {profile.role}
          </Text>
        </View>
      </View>

      {/* Bio paragraphs */}
      {profile.bio.map((paragraph, i) => (
        <Text key={i} className="text-[15px] leading-[22px]" style={{ color: colors.secondaryText }}>
          {paragraph}
        </Text>
      ))}

      {/* Resume button */}
      <TouchableOpacity
        className="flex-row items-center justify-center gap-2 h-[54px] rounded-2xl mt-1"
        style={{ backgroundColor: colors.primary }}
        activeOpacity={0.85}
        onPress={() => openLink(profile.resumeUrl)}
      >
        <Ionicons name="download-outline" size={18} color={colors.text} />
        <Text className="text-base font-semibold" style={{ color: colors.text }}>
          Download résumé
        </Text>
      </TouchableOpacity>

      {/* Social row */}
      <View className="flex-row gap-2.5 mt-1">
        {socialLinks.map(({ key, iconName, url }) => (
          <TouchableOpacity
            key={key}
            className="flex-1 aspect-square rounded-[14px] border items-center justify-center"
            style={[{ backgroundColor: colors.card, borderColor: colors.border }]}
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