import { View, Text } from "react-native";
import ProjectCard from "../shared_components/ProjectCard";
import { Project } from "./ProjectsData";
import { useTheme } from "../../context/useTheme";
import { primaryProjectImage } from "../../utils/projectImages";
import { useResponsiveContainer, useResponsiveColumns, gridCellStyle } from "../../utils/responsive";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();
  const columns = useResponsiveColumns(360, 1);

  if (projects.length === 0) {
    return (
      <View style={[container, { paddingHorizontal: 20, paddingTop: 32 }]} className="items-center">
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
    <View style={[container, { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, paddingTop: 16, rowGap: 24 }]}>
      {projects.map((project) => (
        <View key={project.id} style={gridCellStyle(columns, 24)}>
          <ProjectCard
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
        </View>
      ))}
    </View>
  );
}