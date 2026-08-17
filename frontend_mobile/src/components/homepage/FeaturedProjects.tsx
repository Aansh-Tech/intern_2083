import { View } from "react-native";
import ProjectCard from "../shared_components/ProjectCard";
import { useProject } from "../../context/ProjectContext";
import { useResponsiveContainer, useResponsiveColumns, gridCellStyle } from "../../utils/responsive";

export default function FeaturedProjects() {
  const { projects } = useProject();
  const featured = projects.filter((p) => p.featured);
  const columns = useResponsiveColumns(360, 1);
  const container = useResponsiveContainer();

  if (featured.length === 0) return null;

  return (
    <View className="pt-6">
      <View style={[container, { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, rowGap: 24 }]}>
        {featured.map((project) => (
          <View key={project.id} style={gridCellStyle(columns, 24)}>
            <ProjectCard
              id={Number(project.id)}
              title={project.title}
              category={project.category}
              description={project.description}
              gradient={project.gradient}
              githubUrl={project.githubUrl || "https://github.com"}
              featured={project.featured}
              image={project.images?.[0]?.url ?? project.image}
            />
          </View>
        ))}
      </View>
    </View>
  );
}