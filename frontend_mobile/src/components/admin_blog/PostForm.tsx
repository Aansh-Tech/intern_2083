import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from "react-native";
import { X, Save } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { BlogPostItem } from "./BlogCard";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface PostFormModalProps {
  visible: boolean;
  mode: "create" | "edit";
  initialPost: BlogPostItem | null;
  onClose: () => void;
  onSubmit: (post: BlogPostItem) => void;
}

export default function PostFormModal({
  visible,
  mode,
  initialPost,
  onClose,
  onSubmit,
}: PostFormModalProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(initialPost?.title ?? "");
      setSlug(initialPost?.slug ?? "");
      setCategory(initialPost?.category ?? "");
      setSlugTouched(!!initialPost);
    }
  }, [visible, initialPost]);

  const handleChangeTitle = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleChangeSlug = (value: string) => {
    setSlugTouched(true);
    setSlug(value);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      id: initialPost?.id ?? Date.now().toString(),
      title: title.trim(),
      slug: slugify(slug) || slugify(title),
      category: category.trim() || "General",
      status: initialPost?.status ?? "draft",
      date: initialPost?.date ?? null,
    });
  };

  const fieldStyle = {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <View
          className="flex-row items-center justify-between border-b px-5 py-4"
          style={{ borderColor: colors.border }}
        >
          <Text className="text-[18px] font-bold" style={{ color: colors.text }}>
            {mode === "create" ? "New post" : "Edit post"}
          </Text>
          <TouchableOpacity
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.card }}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerClassName="gap-5 p-5">
          <View className="gap-2">
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={handleChangeTitle}
              placeholder="Post title"
              placeholderTextColor={colors.secondaryText}
              className="h-12 rounded-2xl border px-4 text-[15px]"
              style={fieldStyle}
               cursorColor={colors.primary}
               selectionColor={colors.primary}
            />
          </View>

          <View className="gap-2">
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              Slug
            </Text>
            <TextInput
              value={slug}
              onChangeText={handleChangeSlug}
              placeholder="post-slug"
              placeholderTextColor={colors.secondaryText}
              autoCapitalize="none"
              className="h-12 rounded-2xl border px-4 text-[15px]"
              style={fieldStyle}
               cursorColor={colors.primary}
               selectionColor={colors.primary}
            />
          </View>

          <View className="gap-2">
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              Category
            </Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Design"
              placeholderTextColor={colors.secondaryText}
              className="h-12 rounded-2xl border px-4 text-[15px]"
              style={fieldStyle}
               cursorColor={colors.primary}
               selectionColor={colors.primary}
            />
          </View>

          <TouchableOpacity
            className="mt-2 h-13 flex-row items-center justify-center gap-2 rounded-full py-3.5"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            <Save size={16} color={colors.text} />
            <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>
              {mode === "create" ? "Create post" : "Save changes"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}