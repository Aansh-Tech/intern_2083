import { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Plus, Search } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import BlogPostCard, { BlogPostItem } from "./BlogCard";
import PostFormModal from "./PostForm";

const initialPosts: BlogPostItem[] = [
  {
    id: "designing-for-quiet-interfaces",
    title: "Designing for Quiet Interfaces",
    slug: "designing-for-quiet-interfaces",
    category: "Design",
    status: "published",
    date: "Oct 7, 2024",
  },
  {
    id: "shipping-a-design-system-in-a-quarter",
    title: "Shipping a Design System in a Quarter",
    slug: "shipping-a-design-system-in-a-quarter",
    category: "Systems",
    status: "published",
    date: "Aug 21, 2024",
  },
  {
    id: "notes-on-typography",
    title: "Notes on Typography",
    slug: "notes-on-typography",
    category: "Type",
    status: "published",
    date: "Jun 13, 2024",
  },
  {
    id: "on-building-for-focus",
    title: "On Building for Focus",
    slug: "on-building-for-focus",
    category: "Craft",
    status: "draft",
    date: null,
  },
];

const formatToday = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function BlogControl() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<BlogPostItem[]>(initialPosts);
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
    );
  }, [posts, query]);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingPost(null);
    setModalVisible(true);
  };

  const openEditModal = (post: BlogPostItem) => {
    setModalMode("edit");
    setEditingPost(post);
    setModalVisible(true);
  };

  const handleSubmit = (post: BlogPostItem) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === post.id);
      return exists ? prev.map((p) => (p.id === post.id ? post : p)) : [post, ...prev];
    });
    setModalVisible(false);
  };

  const togglePublish = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;
        const nextStatus = post.status === "published" ? "draft" : "published";
        return {
          ...post,
          status: nextStatus,
          date: nextStatus === "published" ? post.date ?? formatToday() : post.date,
        };
      })
    );
  };

  const deletePost = (id: string, title: string) => {
    Alert.alert("Delete post", `Delete "${title}"? This can't be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setPosts((prev) => prev.filter((post) => post.id !== id)),
      },
    ]);
  };

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-5 pb-10"
      >
        <View className="flex-row items-start justify-between pt-2">
          <View className="gap-1">
            <Text className="text-[26px] font-bold" style={{ color: colors.text }}>
              Blog posts
            </Text>
            <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
              {posts.length} total
            </Text>
          </View>

          <TouchableOpacity
            className="h-11 flex-row items-center gap-2 rounded-full px-4"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.85}
            onPress={openCreateModal}
          >
            <Plus size={16} color={colors.text} />
            <Text className="text-[14px] font-semibold" style={{ color: colors.text }}>
              New
            </Text>
          </TouchableOpacity>
        </View>

        <View
          className="h-14 flex-row items-center gap-3 rounded-2xl border px-4"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <Search size={18} color={colors.secondaryText} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search posts..."
            placeholderTextColor={colors.secondaryText}
            className="flex-1 text-[15px]"
            style={{ color: colors.text }}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
          />
        </View>

        <View className="gap-4">
          {filteredPosts.map((post) => (
            <BlogPostCard
              key={post.id}
              post={post}
              onTogglePublish={() => togglePublish(post.id)}
              onEdit={() => openEditModal(post)}
              onDelete={() => deletePost(post.id, post.title)}
            />
          ))}

          {filteredPosts.length === 0 && (
            <Text
              className="pt-6 text-center text-[14px]"
              style={{ color: colors.secondaryText }}
            >
              No posts match your search.
            </Text>
          )}
        </View>
      </ScrollView>

      <PostFormModal
        visible={modalVisible}
        mode={modalMode}
        initialPost={editingPost}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
}