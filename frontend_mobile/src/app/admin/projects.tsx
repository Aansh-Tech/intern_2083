import { useState, useCallback, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import ProjectSearch from "../../components/adminprojects/ProjectSearch";
import ProjectCard from "../../components/adminprojects/ProjectCard";
import ProjectModal from "../../components/adminprojects/ProjectModal";
import { useProject } from "../../context/ProjectContext";
import { useTheme } from "../../context/useTheme";
import { uploadProjectImage, deleteImage, dedupeImages } from "../../services/image";
import { buildProjectPayload } from "../../services/project";
import type { Project, ProjectPhoto } from "../../types/project";
import { MAX_PROJECT_PHOTOS } from "../../types/project";

console.log = () => {};
console.info = () => {};
console.debug = () => {};
export default function AdminProjectsScreen() {
  const { colors } = useTheme();
  const { projects, loading, refreshing, refreshProjects, addProject, editProject, deleteProject, toggleFeatured, toggleCompleted } = useProject();
  console.log(useProject());

  const handleAdminRefresh = useCallback(() => {
    refreshProjects(true);
  }, [refreshProjects]);

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const savingRef = useRef(false);
  const router = useRouter();

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
        Alert.alert("Error", "A project can have at most 5 photos.");
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
      } catch (error: any) {
        console.error("Failed to save project or upload images:", error);
        Alert.alert("Error", "Failed to save project or upload its images.");
      }
    },
    [addProject, refreshProjects]
  );

  const handleEdit = useCallback(
    async (id: string, data: any) => {
      const photos = dedupeImages((data.photos ?? []) as ProjectPhoto[]);
      if (photos.length > MAX_PROJECT_PHOTOS) {
        Alert.alert("Error", "A project can have at most 5 photos.");
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
      } catch (error: any) {
        console.error("Failed to save project or upload its images:", error);
        Alert.alert("Error", "Failed to save project or its images.");
      }
    },
    [editTarget, editProject, refreshProjects]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteProject(deleteTarget.id);
    await refreshProjects(true);
    setDeleteTarget(null);
  }, [deleteTarget, deleteProject, refreshProjects]);

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
      <View className="px-5 pt-4">
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
        <View className="px-5 pt-4 pb-8 gap-4">
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPress={() => router.push(`/project/${project.id}`)}
              onEdit={setEditTarget}
              onToggleFeatured={toggleFeatured}
              onToggleCompleted={toggleCompleted}
              onDelete={setDeleteTarget}
            />
          ))}
        </View>
      )}

      {deleteTarget && (
        <View
          className="absolute inset-0 items-center justify-center px-8"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 100 }}
        >
          <View
            className="w-full rounded-3xl border p-6 items-center"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <Text className="text-[20px] font-bold" style={{ color: colors.text }}>Delete Project</Text>
            <Text className="text-[14px] text-center mt-2" style={{ color: colors.secondaryText }}>
              Are you sure you want to delete "{deleteTarget.title}"?
            </Text>
            <View className="flex-row gap-3 mt-6 w-full">
              <TouchableOpacity
                className="flex-1 h-[50px] rounded-full border items-center justify-center"
                style={{ borderColor: colors.border }}
                onPress={() => setDeleteTarget(null)}
                activeOpacity={0.8}
              >
                <Text className="text-[15px] font-semibold" style={{ color: colors.secondaryText }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 h-[50px] rounded-full items-center justify-center"
                style={{ backgroundColor: "#EF4444" }}
                onPress={handleDelete}
                activeOpacity={0.8}
              >
                <Text className="text-[15px] font-bold" style={{ color: "#FFFFFF" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
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
