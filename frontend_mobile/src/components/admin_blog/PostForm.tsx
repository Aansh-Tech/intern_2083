// src/components/admin_blog/PostFormModal.tsx
import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Switch,
  Image,
  ActivityIndicator,
} from "react-native";
import { X, Save, Upload } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { BlogPostItem } from "./BlogCard";
import * as ImagePicker from "expo-image-picker";
import api from "../../services/api";
import { getToken } from "../../utils/token";
import { resolveImageUrl } from "../../services/image";

console.log = () => {};
console.info = () => {};
console.debug = () => {};
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
  initialData?: any;
  onClose: () => void;
  onSubmit: (post: BlogPostItem) => void;
}

export default function PostFormModal({
  visible,
  mode,
  initialPost,
  initialData,
  onClose,
  onSubmit,
}: PostFormModalProps) {
  const { colors } = useTheme();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialPost && initialData) {
        populateFromData(initialData);
      } else if (!initialPost) {
        resetForm();
      }
    }
  }, [visible, initialPost, initialData]);

  const unwrapItem = (response: any): any => {
    if (response.data?.data?.data) return response.data.data.data;
    if (response.data?.data) return response.data.data;
    return response.data;
  };

  const populateFromData = (data: any) => {
    setTitle(data.title || "");
    setSlug(data.slug || "");
    setExcerpt(data.excerpt || "");
    setContent(data.content || "");
    setCategory(data.category || "");
    setTags(data.tags ? (Array.isArray(data.tags) ? data.tags.join(", ") : String(data.tags)) : "");
    setStatus(data.status || "draft");
    setPublishedAt(data.published_at
      ? (() => {
          const d = new Date(data.published_at);
          return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
        })()
      : "");
    setAllowComments(data.allow_comments ?? true);
    if (data.images && data.images.length > 0) {
      const featured = data.images.find((img: any) => img.is_primary) || data.images[0];
      if (featured?.image?.url) {
        setFeaturedImage(featured.image.url);
        setImageId(featured.id);
      }
    }
    setSlugTouched(!!data.slug);
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setExcerpt("");
    setContent("");
    setCategory("");
    setTags("");
    setStatus("draft");
    setPublishedAt("");
    setAllowComments(true);
    setFeaturedImage(null);
    setImageFile(null);
    setImageId(null);
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleChangeSlug = (value: string) => {
    setSlugTouched(true);
    setSlug(value);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your media library.");
      return;
    }
    // Use MediaTypeOptions – it works and the warning is harmless
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const mimeType = asset.mimeType || asset.type || "image/jpeg";
      const fileName = asset.fileName || `image_${Date.now()}.jpg`;
      setFeaturedImage(asset.uri);
      setImageFile({
        uri: asset.uri,
        type: mimeType,
        name: fileName,
      });
    }
  };

  const uploadImage = async (postId: string): Promise<string | null> => {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageFile.uri,
        type: imageFile.type,
        name: imageFile.name,
      } as any);
      formData.append("imageable_type", "blog_post");
      formData.append("imageable_id", String(postId));
      formData.append("type", "featured");
      formData.append("is_primary", "1");
      formData.append("display_order", "0");
      formData.append("alt_text", `Featured image for ${title || "post"}`);
      formData.append("caption", "");

      const token = await getToken();
      const response = await api.post("/v1/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 60000,
      });

      console.log("Image upload success:", response.data);
      if (!mountedRef.current) return null;
      setUploading(false);
      const result = response.data.data || response.data;
      const rawUrl = result.path || result.url || result.image || "";
      const resolved = rawUrl ? resolveImageUrl(rawUrl) : null;
      console.log("Image upload resolved URL:", resolved);
      return resolved;
    } catch (error: any) {
      if (!mountedRef.current) return null;
      console.error("Image upload failed:", error);
      setUploading(false);
      let message = "Failed to upload image.";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        message = Object.keys(errors)
          .map((key) => `${key}: ${errors[key].join(", ")}`)
          .join("\n");
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message === "Network Error") {
        message = "Network error – please check your internet connection and try again.";
      }
      Alert.alert("Error", message);
      return null;
    }
  };

  const removeImage = async () => {
    if (imageId) {
      try {
        const token = await getToken();
        await api.delete(`/v1/images/${imageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Failed to delete image", error);
      }
    }
    if (!mountedRef.current) return;
    setFeaturedImage(null);
    setImageFile(null);
    setImageId(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Error", "Content is required.");
      return;
    }

    console.log("publishedAt state:", publishedAt);

    const safeDate = (value: any): string | null => {
      if (!value) return null;
      const date = new Date(value);
      console.log("Converted date:", date);
      if (isNaN(date.getTime())) return null;
      return date.toISOString();
    };

    const postData: any = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category.trim() || "General",
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      status: status,
      published_at: safeDate(publishedAt),
      allow_comments: allowComments,
    };

    console.log("Payload:", postData);

    try {
      let savedPost: BlogPostItem;
      const token = await getToken();

      if (mode === "create") {
        const response = await api.post("/v1/admin/blog-posts", postData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mountedRef.current) return;
        const data = unwrapItem(response);
        const rawDate = data.published_at;
        savedPost = {
          id: String(data.id),
          title: data.title,
          slug: data.slug,
          category: data.category,
          status: data.status,
          date: rawDate && !isNaN(new Date(rawDate).getTime())
            ? new Date(rawDate).toLocaleDateString()
            : null,
          featured_image: null,
        };
        if (imageFile) {
          const uploadedUrl = await uploadImage(String(data.id));
          savedPost.featured_image = uploadedUrl;
        }
      } else {
        if (!initialPost) return;
        const response = await api.put(`/v1/admin/blog-posts/${initialPost.id}`, postData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mountedRef.current) return;
        const data = unwrapItem(response);
        const editRawDate = data.published_at;
        savedPost = {
          id: String(data.id),
          title: data.title,
          slug: data.slug,
          category: data.category,
          status: data.status,
          date: editRawDate && !isNaN(new Date(editRawDate).getTime())
            ? new Date(editRawDate).toLocaleDateString()
            : null,
          featured_image: featuredImage,
        };
        if (imageFile) {
          const uploadedUrl = await uploadImage(String(data.id));
          savedPost.featured_image = uploadedUrl;
        } else if (featuredImage === null && imageId) {
          await removeImage();
          savedPost.featured_image = null;
        }
      }

      onSubmit(savedPost);
      resetForm();
      onClose();
    } catch (error) {
      if (!mountedRef.current) return;
      console.error("Submit failed", error);
      Alert.alert("Error", "Failed to save post.");
    }
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
              Title *
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
              Excerpt (max 300 chars)
            </Text>
            <TextInput
              value={excerpt}
              onChangeText={setExcerpt}
              placeholder="Short summary"
              placeholderTextColor={colors.secondaryText}
              multiline
              numberOfLines={3}
              maxLength={300}
              className="rounded-2xl border px-4 py-2 text-[15px]"
              style={[fieldStyle, { minHeight: 80 }]}
              cursorColor={colors.primary}
              selectionColor={colors.primary}
            />
            <Text className="text-xs text-right" style={{ color: colors.secondaryText }}>
              {excerpt.length}/300
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              Content (Markdown) *
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Write your post content..."
              placeholderTextColor={colors.secondaryText}
              multiline
              numberOfLines={10}
              className="rounded-2xl border px-4 py-2 text-[15px]"
              style={[fieldStyle, { minHeight: 200, textAlignVertical: "top" }]}
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
              placeholder="e.g. Tutorials"
              placeholderTextColor={colors.secondaryText}
              className="h-12 rounded-2xl border px-4 text-[15px]"
              style={fieldStyle}
              cursorColor={colors.primary}
              selectionColor={colors.primary}
            />
          </View>

          <View className="gap-2">
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              Tags (comma separated)
            </Text>
            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="laravel, php, web"
              placeholderTextColor={colors.secondaryText}
              className="h-12 rounded-2xl border px-4 text-[15px]"
              style={fieldStyle}
              cursorColor={colors.primary}
              selectionColor={colors.primary}
            />
          </View>

          <View className="gap-2">
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              Status
            </Text>
            <View className="flex-row gap-3">
              {["draft", "published", "archived"].map((s) => (
                <TouchableOpacity
                  key={s}
                  className="flex-1 py-2 rounded-full border items-center"
                  style={{
                    backgroundColor: status === s ? colors.primary : "transparent",
                    borderColor: colors.border,
                  }}
                  onPress={() => setStatus(s as any)}
                >
                  <Text
                    className="text-[14px] font-semibold capitalize"
                    style={{ color: status === s ? colors.text : colors.secondaryText }}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              Published At
            </Text>
            <TextInput
              value={publishedAt}
              onChangeText={setPublishedAt}
              placeholder="YYYY-MM-DDTHH:mm"
              placeholderTextColor={colors.secondaryText}
              className="h-12 rounded-2xl border px-4 text-[15px]"
              style={fieldStyle}
              cursorColor={colors.primary}
              selectionColor={colors.primary}
            />
            <Text className="text-xs" style={{ color: colors.secondaryText }}>
              Format: YYYY-MM-DDTHH:mm (e.g. 2026-07-18T14:30)
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              Allow comments
            </Text>
            <Switch
              value={allowComments}
              onValueChange={setAllowComments}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={allowComments ? colors.text : colors.secondaryText}
            />
          </View>

          <View className="gap-2">
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              Featured Image
            </Text>
            {featuredImage ? (
              <View className="relative">
                <Image
                  source={{ uri: featuredImage }}
                  className="w-full h-40 rounded-2xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                  onPress={removeImage}
                >
                  <X size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="h-40 rounded-2xl border-2 border-dashed items-center justify-center"
                style={{ borderColor: colors.border }}
                onPress={pickImage}
              >
                <Upload size={32} color={colors.secondaryText} />
                <Text className="mt-2" style={{ color: colors.secondaryText }}>
                  Tap to upload image
                </Text>
              </TouchableOpacity>
            )}
            {uploading && (
              <View className="items-center py-2">
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={{ color: colors.secondaryText }}>Uploading...</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            className="mt-2 h-13 flex-row items-center justify-center gap-2 rounded-full py-3.5"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={uploading}
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