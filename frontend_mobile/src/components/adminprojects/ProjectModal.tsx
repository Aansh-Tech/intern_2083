import { useState, useEffect, memo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";
import type { Project } from "../../types/project";
import { useTheme } from "../../context/useTheme";

interface ProjectModalProps {
  visible: boolean;
  project?: Project | null;
  onClose: () => void;
  onSave: (data: {
    title: string;
    category: string;
    description: string;
    githubUrl?: string;
    viewDetailsUrl?: string;
    image?: string;
    featured: boolean;
    completed: boolean;
  }) => void;
}

function ProjectModal({ visible, project, onClose, onSave }: ProjectModalProps) {
  const { colors } = useTheme();
  const isEdit = !!project;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [viewDetailsUrl, setViewDetailsUrl] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCategory(project.category);
      setSlug(project.slug);
      setDescription(project.description);
      setGithubUrl(project.githubUrl || "");
      setViewDetailsUrl(project.viewDetailsUrl || "");
      setImage(project.image || "");
      setFeatured(project.featured);
      setCompleted(!!project.completed);
    } else {
      setTitle("");
      setCategory("");
      setSlug("");
      setDescription("");
      setGithubUrl("");
      setViewDetailsUrl("");
      setImage("");
      setFeatured(false);
      setCompleted(false);
    }
    setErrors({});
  }, [project, visible]);

  const handleSlugGenerate = useCallback((text: string) => {
    setTitle(text);
    if (!slug || slug === generateSlugFromTitle()) {
      setSlug(
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }, [slug]);

  function generateSlugFromTitle() {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const handleSave = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!category.trim()) newErrors.category = "Category is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      githubUrl: githubUrl.trim() || undefined,
      viewDetailsUrl: viewDetailsUrl.trim() || undefined,
      image: image.trim() || undefined,
      featured,
      completed,
    });
  }, [title, category, description, githubUrl, viewDetailsUrl, image, featured, completed, onSave]);

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable className="flex-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onPress={onClose}>
          <Pressable
            className="flex-1 mt-16 rounded-t-3xl"
            style={{ backgroundColor: colors.background }}
            onPress={() => {}}
          >
            <View className="flex-row justify-between items-center px-5 pt-5 pb-2">
              <Text className="text-[20px] font-bold" style={{ color: colors.text }}>
                {isEdit ? "Edit Project" : "Add Project"}
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <X size={22} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-5 pb-10" showsVerticalScrollIndicator={false}>
              <Field label="Project Name *" error={errors.title}>
                <Input value={title} onChangeText={handleSlugGenerate} placeholder="Enter project name" />
              </Field>
              <Field label="Category *" error={errors.category}>
                <Input value={category} onChangeText={setCategory} placeholder="SaaS / Analytics" />
              </Field>
              <Field label="Slug">
                <Input value={slug} onChangeText={setSlug} placeholder="auto-generated" />
              </Field>
              <Field label="Description *" error={errors.description}>
                <Input
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe the project..."
                  multiline
                />
              </Field>
              <Field label="GitHub URL">
                <Input value={githubUrl} onChangeText={setGithubUrl} placeholder="https://github.com/..." />
              </Field>
              <Field label="Live URL">
                <Input value={viewDetailsUrl} onChangeText={setViewDetailsUrl} placeholder="https://..." />
              </Field>
              <Field label="Image URL (optional)">
                <Input value={image} onChangeText={setImage} placeholder="https://..." />
              </Field>
              <Field label="Featured">
                <Switch
                  value={featured}
                  onValueChange={setFeatured}
                  trackColor={{ false: colors.border, true: colors.primary + "80" }}
                  thumbColor={featured ? colors.primary : colors.secondaryText}
                />
              </Field>
              <Field label="Completed">
                <Switch
                  value={completed}
                  onValueChange={setCompleted}
                  trackColor={{ false: colors.border, true: colors.primary + "80" }}
                  thumbColor={completed ? colors.primary : colors.secondaryText}
                />
              </Field>

              <View className="flex-row gap-3 mt-6 mb-10">
                <TouchableOpacity
                  className="flex-1 h-[50px] rounded-full border items-center justify-center"
                  style={{ borderColor: colors.border }}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text className="text-[15px] font-semibold" style={{ color: colors.secondaryText }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 h-[50px] rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <Text className="text-[15px] font-bold" style={{ color: colors.text }}>
                    {isEdit ? "Update" : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View className="mb-4">
      <Text className="text-[12px] font-semibold mb-1.5" style={{ color: colors.secondaryText }}>{label}</Text>
      {children}
      {error && <Text className="text-[#EF4444] text-[12px] mt-1">{error}</Text>}
    </View>
  );
}

function Input({
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <TextInput
      className="rounded-[14px] border px-4 py-3 text-[15px]"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        color: colors.text,
        minHeight: multiline ? 90 : 48,
        textAlignVertical: multiline ? "top" : "center",
      }}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.secondaryText}
      multiline={multiline}
      numberOfLines={multiline ? 4 : undefined}
      autoCapitalize="none"
      cursorColor={colors.primary}
      selectionColor={colors.primary}
    />
  );
}

export default memo(ProjectModal);
