import { memo } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { ArrowUpRight, ExternalLink } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/useTheme";
import type { Project } from "../../data/projects";

function ProjectCard({
  title,
  category,
  description,
  gradient,
  githubLink,
  projectLink,
  featured,
}: Project) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View
      className="mx-5 rounded-3xl border overflow-hidden"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      {featured && (
        <View
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md z-10"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-[11px] font-bold uppercase tracking-[0.5px]" style={{ color: colors.text }}>
            Featured
          </Text>
        </View>
      )}

      <TouchableOpacity
        className="absolute top-3 right-3 w-8 h-8 rounded-full items-center justify-center z-10"
        style={{ backgroundColor: colors.background }}
        onPress={() => router.push(projectLink as any)}
        activeOpacity={0.7}
      >
        <ArrowUpRight size={16} color={colors.primary} />
      </TouchableOpacity>

      <View style={[{ height: 160, backgroundColor: gradient[0] }]}>
        <View
          className="absolute inset-0"
          style={[{ backgroundColor: gradient[1], opacity: 0.4 }]}
        />
      </View>

      <View className="p-6 gap-2">
        <Text className="text-xs font-semibold uppercase tracking-[1px]" style={{ color: colors.primary }}>
          {category}
        </Text>
        <Text className="text-xl font-bold" style={{ color: colors.text }}>{title}</Text>
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
            onPress={() => router.push(projectLink as any)}
            activeOpacity={0.8}
          >
            <Text className="text-[13px] font-semibold" style={{ color: colors.text }}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-10 h-10 rounded-full border items-center justify-center"
            style={{ borderColor: colors.border }}
            onPress={() => Linking.openURL(githubLink)}
            activeOpacity={0.8}
          >
            <ExternalLink size={18} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default memo(ProjectCard);