import { View } from "react-native";
import ProjectCard from "../shared_components/ProjectCard";
import { useProject } from "../../context/ProjectContext";

export default function FeaturedProjects() {
  const { projects } = useProject();
  const featured = projects.filter((p) => p.featured);

  if (featured.length === 0) return null;

  return (
    <View className="gap-6 pt-6">
      {featured.map((project) => (
        <ProjectCard
          key={project.id}
          id={Number(project.id)}
          title={project.title}
          category={project.category}
          description={project.description}
          gradient={project.gradient}
          githubUrl={project.githubUrl || "https://github.com"}
          featured={project.featured}
          image={project.images?.[0]?.url ?? project.image}
        />
      ))}
    </View>
  );
}