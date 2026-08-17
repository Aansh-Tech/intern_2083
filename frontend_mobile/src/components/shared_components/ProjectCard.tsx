import { memo, useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUpRight, ExternalLink, FolderKanban } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/useTheme";

export type ProjectCardStatus = "completed" | "in-progress";

interface ProjectCardProps {
  id: string | number;
  title: string;
  category: string;
  description: string;
  gradient: readonly [string, string] | string[];
  githubUrl?: string;
  featured?: boolean;
  status?: ProjectCardStatus;
  image?: string | null;
  /** Where the top-right arrow navigates. Home page: Projects tab. */
  arrowTo?: string;
}

const STATUS_LABEL: Record<ProjectCardStatus, string> = {
  completed: "COMPLETED",
  "in-progress": "IN PROGRESS",
};

/**
 * The single project card used across the public pages (Home + Projects).
 * The Home page rendering is the visual source of truth; the Projects page
 * uses the exact same card so both pages share one visual language.
 */
function ProjectCard({
  id,
  title,
  category,
  description,
  gradient,
  githubUrl,
  featured,
  status,
  image,
  arrowTo = "/(tabs)/project",
}: ProjectCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [image]);

  const showImage = !!image && !imageError;
  const statusLabel = status ? STATUS_LABEL[status] : undefined;

  return (
    <View
      className="rounded-3xl border overflow-hidden"
      style={[
        { backgroundColor: colors.card, borderColor: colors.border, width: "100%" },
      ]}
    >
      {(featured || statusLabel) && (
        <View className="absolute top-3 left-3 z-10 flex-row items-center gap-2">
          {featured && (
            <View className="px-2.5 py-1 rounded-md" style={{ backgroundColor: colors.primary }}>
              <Text
                className="text-[11px] font-bold uppercase tracking-[0.5px]"
                style={{ color: colors.text }}
              >
                Featured
              </Text>
            </View>
          )}
          {statusLabel && (
            <View className="px-2.5 py-1 rounded-md" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
              <Text
                className="text-[11px] font-bold uppercase tracking-[0.5px]"
                style={{ color: "#FFFFFF" }}
              >
                {statusLabel}
              </Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        className="absolute top-3 right-3 w-8 h-8 rounded-full items-center justify-center z-10"
        style={{ backgroundColor: colors.background }}
        onPress={() => router.push(arrowTo as any)}
        activeOpacity={0.7}
      >
        <ArrowUpRight size={16} color={colors.primary} />
      </TouchableOpacity>

      {showImage ? (
        <Image
          source={{ uri: image }}
          style={{ width: "100%", aspectRatio: 16 / 9 }}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <LinearGradient
          colors={gradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ aspectRatio: 16 / 9 }}
        >
          <View className="absolute -right-8 -bottom-10 opacity-[0.15]" pointerEvents="none">
            <FolderKanban size={150} color="#FFFFFF" strokeWidth={1.5} />
          </View>
          <View className="flex-1 items-center justify-center">
            <View
              className="w-12 h-12 rounded-2xl items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
            >
              <FolderKanban size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text
              className="text-[11px] font-bold tracking-[3px] mt-1.5"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              PROJECT
            </Text>
            {category ? (
              <Text
                className="text-[10px] font-semibold uppercase tracking-[1.5px] mt-0.5"
                style={{ color: "rgba(255,255,255,0.65)" }}
                numberOfLines={1}
              >
                {category}
              </Text>
            ) : null}
          </View>
        </LinearGradient>
      )}

      <View className="p-6 gap-2">
        <Text
          className="text-xs font-semibold uppercase tracking-[1px]"
          style={{ color: colors.primary }}
        >
          {category}
        </Text>
        <Text
          className="text-xl font-bold"
          style={{ color: colors.text }}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          className="text-sm leading-5"
          style={{ color: colors.secondaryText }}
          numberOfLines={2}
        >
          {description}
        </Text>

        <View className="flex-row items-center gap-2.5 mt-3">
          <TouchableOpacity
            className="py-2.5 px-5 rounded-[20]"
            style={{ backgroundColor: colors.primary }}
            onPress={() => router.push(`/project/${id}` as any)}
            activeOpacity={0.8}
          >
            <Text className="text-[13px] font-semibold" style={{ color: colors.text }}>
              View Details
            </Text>
          </TouchableOpacity>

          {githubUrl && (
            <TouchableOpacity
              className="w-10 h-10 rounded-full border items-center justify-center"
              style={{ borderColor: colors.border }}
              onPress={() => Linking.openURL(githubUrl)}
              activeOpacity={0.8}
            >
              <ExternalLink size={18} color={colors.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export default memo(ProjectCard);