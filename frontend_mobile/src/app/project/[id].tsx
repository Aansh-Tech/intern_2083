import { useMemo } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Image } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ExternalLink } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useProject } from "../../context/ProjectContext";
import StatusBadge from "../../components/work/StatusBadge";

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { projects, loading } = useProject();

  const project = useMemo(
    () => projects.find((p) => p.id === id),
    [projects, id]
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            Project not found
          </Text>
          <Text style={{ fontSize: 14, color: colors.secondaryText, textAlign: "center", marginBottom: 24 }}>
            The project you are looking for does not exist or has been removed.
          </Text>
          <TouchableOpacity
            style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, backgroundColor: colors.primary }}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
              Go back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.card }}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {project.image ? (
          <Image
            source={{ uri: project.image }}
            style={{ width: "100%", aspectRatio: 16 / 9 }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: 48, fontWeight: "700", color: colors.primary }}>
              {project.title.charAt(0)}
            </Text>
          </View>
        )}

        <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 16 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <StatusBadge variant={project.status === "completed" || project.completed ? "completed" : "in-progress"} />
            {project.featured && <StatusBadge variant="featured" />}
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", color: colors.secondaryText }}>
              {project.category}
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.text }}>
              {project.title}
            </Text>
          </View>

          <Text style={{ fontSize: 15, lineHeight: 22, color: colors.secondaryText }}>
            {project.description}
          </Text>

          {project.technologies && project.technologies.length > 0 && (
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", color: colors.secondaryText }}>
                Technologies
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {project.technologies.map((tech) => (
                  <View
                    key={tech}
                    style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
                  >
                    <Text style={{ fontSize: 13, color: colors.text }}>{tech}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ flexDirection: "row", gap: 12, paddingTop: 8 }}>
            {project.viewDetailsUrl && (
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 48, borderRadius: 24, backgroundColor: colors.primary }}
                activeOpacity={0.8}
                onPress={() => Linking.openURL(project.viewDetailsUrl!)}
              >
                <ExternalLink size={18} color={colors.text} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
                  Live Demo
                </Text>
              </TouchableOpacity>
            )}
            {project.githubUrl && (
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}
                activeOpacity={0.8}
                onPress={() => Linking.openURL(project.githubUrl!)}
              >
                <ExternalLink size={18} color={colors.text} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
                  GitHub
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {project.dateAdded && (
            <View style={{ paddingTop: 8, paddingBottom: 24 }}>
              <Text style={{ fontSize: 12, color: colors.secondaryText }}>
                Added on {new Date(project.dateAdded).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
