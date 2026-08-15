import { View, Text } from "react-native";
import ProjectCard from "../shared_components/ProjectCard";
import { Project } from "./ProjectsData";
import { useTheme } from "../../context/useTheme";
import { primaryProjectImage } from "../../utils/projectImages";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const { colors } = useTheme();

  if (projects.length === 0) {
    return (
      <View className="px-5 pt-8 items-center">
        <Text
          className="text-[14px] text-center"
          style={{ color: colors.secondaryText }}
        >
          No projects match this filter yet.
        </Text>
      </View>
    );
  }

  return (
    <View className="pt-4 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.title}
          category={project.category}
          description={project.description}
          gradient={project.gradient}
          githubUrl={project.githubUrl}
          featured={project.featured}
          status={project.status}
          image={primaryProjectImage(project)}
          arrowTo={`/project/${project.id}`}
        />
      ))}
    </View>
  );
}