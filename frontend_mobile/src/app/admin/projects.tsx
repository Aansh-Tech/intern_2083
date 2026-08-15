import { useState, useCallback, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import ProjectSearch from "../../components/adminprojects/ProjectSearch";
import ProjectCard from "../../components/adminprojects/ProjectCard";
import ProjectModal from "../../components/adminprojects/ProjectModal";
import { usePopup } from "../../components/Popup";
import { useProject } from "../../context/ProjectContext";
import { useTheme } from "../../context/useTheme";
import { uploadProjectImage, deleteImage, dedupeImages } from "../../services/image";
import { buildProjectPayload } from "../../services/project";
import type { Project, ProjectPhoto } from "../../types/project";
import { MAX_PROJECT_PHOTOS } from "../../types/project";
import { useResponsiveContainer } from "../../utils/responsive";

console.log = () => {};
console.info = () => {};
console.debug = () => {};
export default function AdminProjectsScreen() {
  const { colors } = useTheme();
  const { showModal, showConfirm, showToast } = usePopup();
  const { projects, loading, refreshing, refreshProjects, addProject, editProject, deleteProject, toggleFeatured, toggleCompleted } = useProject();

  const handleAdminRefresh = useCallback(() => {
    refreshProjects(true);
  }, [refreshProjects]);

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const savingRef = useRef(false);
  const router = useRouter();
  const headerContainer = useResponsiveContainer();
  const listContainer = useResponsiveContainer();

  const displayedProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const handleAdd = useCallback(
    async (data: {
      title: string;
      category: string;
      description: string;
      githubUrl?: string;
      viewDetailsUrl?: string;
      slug?: string;
      photos: ProjectPhoto[];
      featured: boolean;
      completed: boolean;
    }) => {
      const newPhotos = dedupeImages(data.photos).filter((p) => p.isNew);
      if (
        data.photos.length > MAX_PROJECT_PHOTOS ||
        newPhotos.length > MAX_PROJECT_PHOTOS
      ) {
        showModal({
          type: "warning",
          title: "Too many photos",
          message: "A project can have at most 5 photos.",
          primaryText: "OK",
        });
        return;
      }
      try {
        const newProject = await addProject({
          title: data.title,
          category: data.category,
          description: data.description,
          githubUrl: data.githubUrl,
          viewDetailsUrl: data.viewDetailsUrl,
          slug: data.slug,
          featured: data.featured,
          completed: data.completed,
        });

        if (newProject?.id) {
          for (let i = 0; i < newPhotos.length; i++) {
            const uploaded = await uploadProjectImage(newPhotos[i].uri, "project", newProject.id, {
              isPrimary: i === 0,
              displayOrder: i,
            });
            newPhotos[i].id = uploaded.id;
            newPhotos[i].uri = uploaded.url;
            newPhotos[i].isNew = false;
          }
        }

        await refreshProjects(true);
        setModalVisible(false);
        showToast({ type: "success", message: "Project saved successfully" });
      } catch (error: any) {
        console.error("Failed to save project or upload images:", error);
        showModal({
          type: "error",
          title: "Something went wrong",
          message: "Failed to save project or upload its images.",
          primaryText: "OK",
        });
      }
    },
    [addProject, refreshProjects, showModal, showToast]
  );

  const handleEdit = useCallback(
    async (id: string, data: any) => {
      const photos = dedupeImages((data.photos ?? []) as ProjectPhoto[]);
      if (photos.length > MAX_PROJECT_PHOTOS) {
        showModal({
          type: "warning",
          title: "Too many photos",
          message: "A project can have at most 5 photos.",
          primaryText: "OK",
        });
        return;
      }

      const existingPhotos = photos.filter((p) => !p.isNew);
      const newPhotos = photos.filter((p) => p.isNew);
      const keptIds = new Set<string>();
      for (const p of existingPhotos) {
        if (p.id !== undefined && p.id !== null && p.id !== "") {
          keptIds.add(String(p.id));
        }
      }
      const removedPhotos = (editTarget?.images ?? []).filter(
        (img) => img.id !== undefined && img.id !== null && !keptIds.has(String(img.id))
      );

      try {
        for (const removed of removedPhotos) {
          await deleteImage(removed.id);
        }

        await editProject(id, buildProjectPayload(data));

        const slots = MAX_PROJECT_PHOTOS - existingPhotos.length;
        const toUpload = slots > 0 ? newPhotos.slice(0, slots) : [];
        const maxOrder = existingPhotos.reduce(
          (max, p) => Math.max(max, p.order ?? 0),
          -1
        );
        for (let i = 0; i < toUpload.length; i++) {
          const uploaded = await uploadProjectImage(toUpload[i].uri, "project", id, {
            isPrimary: existingPhotos.length === 0 && i === 0,
            displayOrder: maxOrder + 1 + i,
          });
          toUpload[i].id = uploaded.id;
          toUpload[i].uri = uploaded.url;
          toUpload[i].isNew = false;
        }

        await refreshProjects(true);
        setEditTarget(null);
        showToast({ type: "success", message: "Project saved successfully" });
      } catch (error: any) {
        console.error("Failed to save project or upload its images:", error);
        showModal({
          type: "error",
          title: "Something went wrong",
          message: "Failed to save project or its images.",
          primaryText: "OK",
        });
      }
    },
    [editTarget, editProject, refreshProjects, showModal, showToast]
  );

  const handleDelete = useCallback(
    async (project: Project) => {
      showConfirm({
        title: "Delete project?",
        message: `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        destructive: true,
        onConfirm: async () => {
          try {
            await deleteProject(project.id);
            await refreshProjects(true);
            showToast({ type: "success", message: "Project deleted" });
          } catch (error) {
            showModal({
              type: "error",
              title: "Something went wrong",
              message: "Failed to delete the project.",
              primaryText: "OK",
            });
          }
        },
      });
    },
    [deleteProject, refreshProjects, showConfirm, showModal, showToast]
  );

  const handleModalSave = useCallback(
    (data: {
      title: string;
      category: string;
      description: string;
      githubUrl?: string;
      viewDetailsUrl?: string;
      slug?: string;
      photos: ProjectPhoto[];
      featured: boolean;
      completed: boolean;
    }) => {
      if (savingRef.current) return;
      savingRef.current = true;
      const task = editTarget
        ? handleEdit(editTarget.id, data)
        : handleAdd(data);
      Promise.resolve(task)
        .catch(() => {})
        .finally(() => {
          savingRef.current = false;
        });
    },
    [editTarget, handleEdit, handleAdd]
  );

  return (
    <AdminLayout refreshing={refreshing} onRefresh={handleAdminRefresh}>
      <View style={[headerContainer, { paddingHorizontal: 20, paddingTop: 16 }]}>
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-[11px] font-semibold tracking-[1.5px]" style={{ color: colors.primary }}>
              CONTENT
            </Text>
            <Text className="text-[22px] font-bold mt-1" style={{ color: colors.text }}>Projects</Text>
            <Text className="text-[13px] mt-0.5" style={{ color: colors.secondaryText }}>
              Create and update projects shown on the site.
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center h-[40px] rounded-full px-5 gap-1.5"
            style={{ backgroundColor: colors.primary }}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text className="text-[13px] font-semibold" style={{ color: colors.text }}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ProjectSearch value={searchQuery} onChangeText={setSearchQuery} />

      {loading ? null : displayedProjects.length === 0 ? (
        <View className="items-center justify-center px-10 pt-16 pb-20">
          <Text className="text-[20px] font-bold" style={{ color: colors.text }}>No Projects</Text>
          <Text className="text-[14px] text-center mt-2" style={{ color: colors.secondaryText }}>
            Create your first project to get started.
          </Text>
          <TouchableOpacity
            className="h-[44px] rounded-full px-6 items-center justify-center mt-5"
            style={{ backgroundColor: colors.primary }}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text className="text-[14px] font-semibold" style={{ color: colors.text }}>Add Project</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[listContainer, { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, gap: 16 }]}>
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPress={() => router.push(`/project/${project.id}`)}
              onEdit={setEditTarget}
              onToggleFeatured={toggleFeatured}
              onToggleCompleted={toggleCompleted}
              onDelete={() => handleDelete(project)}
            />
          ))}
        </View>
      )}

      <ProjectModal
        visible={modalVisible || !!editTarget}
        project={editTarget}
        onClose={() => { setModalVisible(false); setEditTarget(null); }}
        onSave={handleModalSave}
      />


    </AdminLayout>
  );
}
