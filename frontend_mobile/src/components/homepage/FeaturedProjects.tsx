import { View } from "react-native";
import ProjectCard from "./ProjectCard";
import { projects } from "../../data/projects";

export default function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <View className="gap-6 pt-6">
      {featured.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </View>
  );
}