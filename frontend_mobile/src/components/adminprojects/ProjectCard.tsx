import { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";
import type { Project } from "../../types/project";
import ProjectMenu from "./ProjectMenu";
import { useTheme } from "../../context/useTheme";

interface ProjectCardProps {
  project: Project;
  onPress?: (project: Project) => void;
  onEdit: (project: Project) => void;
  onToggleFeatured: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onDelete: (project: Project) => void;
}

function ProjectCard({
  project,
  onPress,
  onEdit,
  onToggleFeatured,
  onToggleCompleted,
  onDelete,
}: ProjectCardProps) {
  const { colors } = useTheme();
  const projectImage = project.images?.[0]?.url ?? project.image;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(project)}
      className="rounded-3xl border overflow-hidden"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {projectImage && (
        <Image
          source={{ uri: projectImage }}
          style={{ width: "100%", height: 140 }}
          resizeMode="cover"
        />
      )}
      <View className="p-5">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 gap-1.5">
            <View className="flex-row items-center gap-2">
              <Text className="text-[16px] font-bold" style={{ color: colors.text }}>
                {project.title}
              </Text>
              {project.featured && (
                <Star size={14} color={colors.primary} fill={colors.primary} />
              )}
            </View>
            <Text className="text-[12px]" style={{ color: colors.secondaryText }}>
              {project.slug}
            </Text>
            <Text className="text-[12px] font-medium" style={{ color: colors.primary }}>
              {project.category}
            </Text>
            <View className="flex-row items-center gap-2 mt-0.5">
              <View
                className="px-2.5 py-1 rounded-full self-start"
                style={{
                  backgroundColor: project.completed ? "#22C55E20" : "#3B82F620",
                }}
              >
                <Text
                  className="text-[11px] font-bold tracking-[0.3px]"
                  style={{ color: project.completed ? "#22C55E" : "#3B82F6" }}
                >
                  {project.completed ? "Completed" : "In Progress"}
                </Text>
              </View>
              <Text className="text-[11px]" style={{ color: colors.secondaryText }}>
                {project.dateAdded}
              </Text>
            </View>
          </View>
          <ProjectMenu
            featured={project.featured}
            completed={!!project.completed}
            onEdit={() => onEdit(project)}
            onToggleFeatured={() => onToggleFeatured(project.id)}
            onToggleCompleted={() => onToggleCompleted(project.id)}
            onDelete={() => onDelete(project)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProjectCard);
