import { View } from "react-native";
import ProjectCard from "./ProjectCard";
import { useProject } from "../../context/ProjectContextOld";

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
          gradient={project.gradient as any}
          githubLink={project.githubUrl || "https://github.com"}
          projectLink={project.viewDetailsUrl || "/project"}
          featured={project.featured}
        />
      ))}
    </View>
  );
}