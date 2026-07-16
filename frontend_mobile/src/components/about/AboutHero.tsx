import { View, Text, TouchableOpacity, Linking, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/useTheme";
import { useProfile } from "../../context/ProfileContext";

const defaultSocialLinks: { key: string; iconName: string; url: string }[] = [
  { key: "github", iconName: "logo-github", url: "https://github.com/aneez11" },
  { key: "linkedin", iconName: "logo-linkedin", url: "https://www.linkedin.com/in/anish-shrestha-4ba524122/" },
  { key: "facebook", iconName: "logo-facebook", url: "https://www.facebook.com/shresthaanish51" },
  { key: "instagram", iconName: "logo-instagram", url: "https://www.instagram.com/aneez_st" },
  { key: "mail", iconName: "mail-outline", url: "mailto:shresthaanish51@gmail.com" },
] as const;

export default function AboutHero() {
  const { colors } = useTheme();
  const { profile } = useProfile();

  const name = profile.name ?? "Anish Shrestha";
  const role = profile.title ?? profile.subtitle ?? profile.headline ?? "Developer & Designer";
  const avatarUrl = profile.avatar ?? profile.profile_image ?? null;
  const resumeUrl = profile.resume ?? null;

  if (!avatarUrl) {
    console.log("[AboutHero] FAIL: Component received null image URL — profile.avatar:", profile.avatar, "profile.profile_image:", profile.profile_image);
  } else {
    console.log("[AboutHero] Image URL received:", avatarUrl.substring(0, 80));
  }

  const bioRaw = profile.bio ?? profile.description ?? "";
  const bioParagraphs = bioRaw ? bioRaw.split("\n").filter((p) => p.trim()) : [];

  const socialLinksMap = profile.social_links ?? {};
  const socialLinks = defaultSocialLinks.map((link) => ({
    ...link,
    url: socialLinksMap[link.key] ?? link.url,
  }));

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View className="px-5 pt-7 gap-4">
      <Text className="text-[13px] font-semibold tracking-[2px]" style={{ color: colors.primary }}>
        ABOUT
      </Text>

      <View className="flex-row items-center gap-4">
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="w-16 h-16 rounded-full" />
        ) : (
          <LinearGradient
            colors={["#A855F7", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-16 h-16 rounded-full items-center justify-center"
          >
            <Text className="text-[22px] font-bold text-white">{initials}</Text>
          </LinearGradient>
        )}

        <View className="flex-1 gap-0.5">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            {name}
          </Text>
          <Text className="text-sm" style={{ color: colors.secondaryText }}>
            {role}
          </Text>
        </View>
      </View>

      {bioParagraphs.map((paragraph, i) => (
        <Text key={i} className="text-[15px] leading-[22px]" style={{ color: colors.secondaryText }}>
          {paragraph}
        </Text>
      ))}

      {resumeUrl ? (
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 h-[54px] rounded-2xl mt-1"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.85}
          onPress={() => openLink(resumeUrl)}
        >
          <Ionicons name="download-outline" size={18} color={colors.text} />
          <Text className="text-base font-semibold" style={{ color: colors.text }}>
            Download résumé
          </Text>
        </TouchableOpacity>
      ) : null}

      <View className="flex-row gap-2.5 mt-1">
        {socialLinks.map(({ key, iconName, url }) => (
          <TouchableOpacity
            key={key}
            className="flex-1 aspect-square rounded-[14px] border items-center justify-center"
            style={[{ backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => openLink(url)}
          >
            <Ionicons name={iconName as any} size={20} color={colors.secondaryText} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}