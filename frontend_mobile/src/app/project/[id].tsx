import { useMemo, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, ExternalLink } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useProject } from "../../context/ProjectContext";
import * as projectService from "../../services/project";
import type { Project } from "../../types/project";
import StatusBadge from "../../components/work/StatusBadge";
import ProjectGallery from "../../components/work/ProjectGallery";
import ProjectCover from "../../components/work/ProjectCover";
import ImageViewer from "../../components/admin_certificates/ImageViewer";
import { normalizeProjectImages } from "../../utils/projectImages";
import { useResponsiveContainer, useResponsiveFontSize } from "../../utils/responsive";

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { projects, loading } = useProject();
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const container = useResponsiveContainer();
  const titleSize = useResponsiveFontSize(28);

  const project = useMemo(
    () => projects.find((p) => p.id === id),
    [projects, id]
  );

  useEffect(() => {
    if (!project?.slug) return;
    setDetailProject(null);
    setDetailLoading(true);
    let mounted = true;
    projectService
      .getProject(project.slug)
      .then((data) => {
        if (mounted) {
          setDetailProject(data as unknown as Project);
          setDetailLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setDetailLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [project?.slug]);

  const isDetailValid = detailProject && detailProject.id === project?.id;
  const source = isDetailValid ? detailProject : project;

  const normalizedImages = useMemo(
    () => normalizeProjectImages(source),
    [source]
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <Stack.Screen options={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <Stack.Screen options={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
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
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            container,
            {
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>

          {project.viewDetailsUrl && (
            <TouchableOpacity
              style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
              activeOpacity={0.7}
              onPress={() => Linking.openURL(project.viewDetailsUrl!)}
            >
              <ExternalLink size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {normalizedImages.length > 0 ? (
          <View style={[container, { paddingHorizontal: 20, paddingTop: 8 }]}>
            <ProjectGallery
              images={normalizedImages}
              onImagePress={(index) => setViewerIndex(index)}
            />
          </View>
        ) : (
          <View style={[container, { paddingTop: 8 }]}>
            <ProjectCover
              gradient={project.gradient}
              category={project.category}
              style={{ marginHorizontal: 20, height: 200, borderRadius: 20 }}
            />
          </View>
        )}

        <View style={[container, { paddingHorizontal: 20, paddingTop: 24, gap: 16 }]}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <StatusBadge variant={project.status === "completed" || project.completed ? "completed" : "in-progress"} />
            {project.featured && <StatusBadge variant="featured" />}
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", color: colors.primary }}>
              {project.category}
            </Text>
            <Text style={{ fontSize: titleSize, fontWeight: "700", color: colors.text }}>
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
                {[...new Set(project.technologies)].map((tech) => (
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

      <ImageViewer
        visible={viewerIndex !== null}
        imageUrl={viewerIndex !== null ? normalizedImages[viewerIndex]?.url ?? null : null}
        onClose={() => setViewerIndex(null)}
      />
    </View>
  );
}