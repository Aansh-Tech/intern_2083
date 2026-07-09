import { View, Text, StyleSheet } from "react-native";
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
      <View style={styles.empty}>
        <Text style={{ color: colors.secondaryText, fontSize: 15 }}>
          No projects match this filter yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 24,
  },
  empty: {
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
});