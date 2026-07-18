// src/components/admin_blog/BlogCard.tsx
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "published" | "draft" | "archived";
  date: string | null;
  featured_image?: string | null;
}

interface BlogPostCardProps {
  post: BlogPostItem;
  onTogglePublish: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BlogPostCard({
  post,
  onTogglePublish,
  onEdit,
  onDelete,
}: BlogPostCardProps) {
  const { colors } = useTheme();
  const isPublished = post.status === "published";

  return (
    <View
      className="gap-3 rounded-[20px] border p-5"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <View className="flex-row gap-3">
        {post.featured_image ? (
          <Image
            source={{ uri: post.featured_image }}
            className="w-20 h-20 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View
            className="w-20 h-20 rounded-xl items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <Text style={{ color: colors.secondaryText }}>No image</Text>
          </View>
        )}
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <View
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: isPublished ? "#10B98122" : colors.background,
              }}
            >
              <Text
                className="text-[11px] font-bold tracking-[0.5px]"
                style={{ color: isPublished ? "#10B981" : colors.secondaryText }}
              >
                {isPublished ? "PUBLISHED" : post.status === "archived" ? "ARCHIVED" : "DRAFT"}
              </Text>
            </View>
            <Text className="text-[13px]" style={{ color: colors.secondaryText }}>
              {post.date ?? "—"}
            </Text>
          </View>
          <Text className="text-[19px] font-bold" style={{ color: colors.text }}>
            {post.title}
          </Text>
          <Text className="text-[13px]" style={{ color: colors.secondaryText }}>
            /{post.slug} · {post.category}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3 mt-1">
        <TouchableOpacity
          className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full border"
          style={{ backgroundColor: colors.background, borderColor: colors.border }}
          activeOpacity={0.7}
          onPress={onTogglePublish}
        >
          {isPublished ? (
            <EyeOff size={16} color={colors.text} />
          ) : (
            <Eye size={16} color={colors.text} />
          )}
          <Text className="text-[14px] font-semibold" style={{ color: colors.text }}>
            {isPublished ? "Unpublish" : "Publish"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="h-12 w-12 items-center justify-center rounded-full border"
          style={{ backgroundColor: colors.background, borderColor: colors.border }}
          activeOpacity={0.7}
          onPress={onEdit}
        >
          <Pencil size={16} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EF444426" }}
          activeOpacity={0.7}
          onPress={onDelete}
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}