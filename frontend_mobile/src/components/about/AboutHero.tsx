import { View, Text, TouchableOpacity, Linking, Image, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { File, Paths } from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system/legacy";
import { useTheme } from "../../context/useTheme";
import { usePopup } from "../Popup";
import { useProfile } from "../../context/ProfileContext";
import { useResponsiveContainer, useResponsiveFontSize } from "../../utils/responsive";

const platformIcons: Record<string, string> = {
  github: "logo-github",
  linkedin: "logo-linkedin",
  facebook: "logo-facebook",
  instagram: "logo-instagram",
  email: "mail-outline",
  website: "globe-outline",
  twitter: "logo-twitter",
  youtube: "logo-youtube",
};

export default function AboutHero() {
  const { colors } = useTheme();
  const { showModal } = usePopup();
  const { profile, photoTimestamp } = useProfile();
  const container = useResponsiveContainer();
  const buttonTextSize = useResponsiveFontSize(16, 0.88, 1);

  const name = profile.name ?? "Anish Shrestha";
  const role = profile.title ?? profile.subtitle ?? profile.headline ?? "Developer & Designer";
  const rawAvatar = profile.avatar ?? profile.profile_image ?? null;
  const avatarUrl = rawAvatar?.startsWith("http") ? `${rawAvatar}${rawAvatar.includes('?') ? '&' : '?'}t=${photoTimestamp}` : rawAvatar;
  const resumeUrl = profile.resume_url ?? null;

  const bioRaw = profile.bio ?? profile.description ?? "";
  const bioParagraphs = bioRaw ? bioRaw.split("\n").filter((p) => p.trim()) : [];

  const socialLinks = (profile.socialLinks ?? []).map((link) => ({
    id: link.id,
    iconName: platformIcons[link.platform.toLowerCase()] ?? "link-outline",
    url: link.platform.toLowerCase() === "email" ? `mailto:${link.url}` : link.url,
  }));

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const openLink = (url: any) => {
    const resolved = typeof url === "string" ? url : url?.url ?? String(url);
    Linking.openURL(resolved).catch(() => {});
  };

  const downloadResume = async (url: string) => {
    try {
      const downloadedFile = await File.downloadFileAsync(url, Paths.document, { idempotent: true });

      if (Platform.OS === "android") {
        const safPermission = await StorageAccessFramework.requestDirectoryPermissionsAsync(
          "Choose a folder to save the resume"
        );
        if (!safPermission.granted) {
          showModal({
            type: "warning",
            title: "Permission Denied",
            message: "Please grant permission to save the file.",
            primaryText: "OK",
          });
          return;
        }
        const safUri = await StorageAccessFramework.createFileAsync(
          safPermission.directoryUri,
          "Resume",
          "application/pdf"
        );
        const base64 = await downloadedFile.base64();
        await StorageAccessFramework.writeAsStringAsync(safUri, base64, {
          encoding: "base64",
        });
      }

      showModal({
        type: "success",
        title: "Resume downloaded",
        message: "Your resume has been saved to your device.",
        primaryText: "OK",
      });
    } catch (error: any) {
      showModal({
        type: "error",
        title: "Download failed",
        message: error?.message ?? "Unable to download the resume. Please try again.",
        primaryText: "OK",
      });
    }
  };

  return (
    <View style={[container, { paddingHorizontal: 20, paddingTop: 28, gap: 16 }]}>
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
        <View className="flex-row gap-3 mt-1">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 h-[54px] rounded-2xl"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.85}
            onPress={() => openLink(resumeUrl)}
          >
            <Ionicons name="eye-outline" size={18} color={colors.text} />
            <Text className="font-semibold" style={{ color: colors.text, fontSize: buttonTextSize }}>
              View Resume
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 h-[54px] rounded-2xl border"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            activeOpacity={0.85}
            onPress={() => downloadResume(resumeUrl)}
          >
            <Ionicons name="download-outline" size={18} color={colors.text} />
            <Text className="font-semibold" style={{ color: colors.text, fontSize: buttonTextSize }}>
              Download Resume
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View className="flex-row gap-2.5 mt-1">
        {socialLinks.map(({ id, iconName, url }) => (
          <TouchableOpacity
            key={id}
            className="w-[44px] h-[44px] rounded-[14px] border items-center justify-center"
            style={[{ backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => openLink(url)}
          >
            <Ionicons name={iconName as any} size={16} color={colors.secondaryText} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
