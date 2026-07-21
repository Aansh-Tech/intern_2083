import { View, Text } from "react-native";
import ProjectCard from "./ProjectCard";
import { Project } from "./ProjectsData";
import { useTheme } from "../../context/useTheme";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const { colors } = useTheme();

  if (projects.length === 0) {
    return (
      <View className="px-5 pt-15 items-center">
        <Text
          className="text-[15px]"
          style={{ color: colors.secondaryText }}
        >
          No projects match this filter yet.
        </Text>
      </View>
    );
  }

  return (
    <View className="px-5 pt-6 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </View>
  );
}