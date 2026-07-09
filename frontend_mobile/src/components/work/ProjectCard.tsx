import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUpRight} from "lucide-react-native";
//import { Github } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import StatusBadge from "./StatusBadge";
import { Project } from "./ProjectsData";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { colors } = useTheme();

  const openLink = (url?: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <LinearGradient
        colors={project.gradient as [string, string]}   
        //colors={project.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.badgeRow}>
          <StatusBadge variant={project.status} />
          {project.featured && <StatusBadge variant="featured" />}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.secondaryText }]}>
          {project.category}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {project.title}
        </Text>
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          {project.description}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={() => openLink(project.viewDetailsUrl)}
          >
            <Text style={[styles.primaryText, { color: colors.text }]}>
              View details
            </Text>
            <ArrowUpRight size={16} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            activeOpacity={0.8}
            onPress={() => openLink(project.githubUrl)}
          >
            {/* <Github size={16} color={colors.text} />  */}
            <Text style={[styles.secondaryText, { color: colors.text }]}>
              GitHub
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    aspectRatio: 6.4,
    justifyContent: "flex-start",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
  },
  content: {
    padding: 20,
    gap: 6,
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 30,
  },
  primaryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 30,
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "600",
  },
});