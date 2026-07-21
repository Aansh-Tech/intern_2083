import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUpRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/useTheme";
import StatusBadge from "./StatusBadge";
import { Project } from "./ProjectsData";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const projectImage = project.images?.[0]?.url ?? project.image;

  const openLink = (url?: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View
      className="rounded-[20px] border overflow-hidden"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      {projectImage ? (
        <View className="w-full aspect-[6.4]">
          <Image
            source={{ uri: projectImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent"]}
            className="absolute inset-0"
          />
          <View className="absolute bottom-3 left-3 flex-row gap-2">
            <StatusBadge variant={project.status} />
            {project.featured && <StatusBadge variant="featured" />}
          </View>
        </View>
      ) : (
        <LinearGradient
          colors={project.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full aspect-[6.4] justify-start"
        >
          <View className="flex-row gap-2 p-4">
            <StatusBadge variant={project.status} />
            {project.featured && <StatusBadge variant="featured" />}
          </View>
        </LinearGradient>
      )}

      <View className="p-5 gap-1.5">
        <Text
          className="text-xs font-semibold tracking-[1px] uppercase"
          style={{ color: colors.secondaryText }}
        >
          {project.category}
        </Text>
        <Text
          className="text-[22px] font-bold mt-0.5"
          style={{ color: colors.text }}
        >
          {project.title}
        </Text>
        <Text
          className="text-[15px] leading-[21px] mt-0.5"
          style={{ color: colors.secondaryText }}
        >
          {project.description}
        </Text>

        <View className="flex-row gap-2.5 mt-3.5">
          <TouchableOpacity
            className="flex-row items-center justify-center gap-1.5 px-[18px] h-11 rounded-[30px]"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}
            onPress={() => router.push(`/project/${project.id}` as any)}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: colors.text }}
            >
              View details
            </Text>
            <ArrowUpRight size={16} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center gap-1.5 px-[18px] h-11 rounded-[30px] border"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            activeOpacity={0.8}
            onPress={() => openLink(project.githubUrl)}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: colors.text }}
            >
              GitHub
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}