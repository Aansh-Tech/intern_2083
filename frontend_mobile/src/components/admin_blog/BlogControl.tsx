// src/components/admin_blog/BlogControl.tsx
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { Plus, Search } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import BlogPostCard, { BlogPostItem } from "./BlogCard";
import PostFormModal from "./PostForm";
import { useComments } from "../../hooks/useComments";
import api from "../../services/api";
import { getToken } from "../../utils/token";

interface BlogControlProps {
  refreshing?: boolean;
  onRefresh?: () => void;
}

const unwrapList = (response: any): any[] => {
  if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
    return response.data.data.data;
  }
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};

const unwrapItem = (response: any): any => {
  if (response.data?.data?.data) return response.data.data.data;
  if (response.data?.data) return response.data.data;
  return response.data;
};

export default function BlogControl({ refreshing: refreshingProp, onRefresh }: BlogControlProps = {}) {
  const [refreshing, setRefreshing] = useState(false);

  const effectiveRefreshing = refreshingProp || refreshing;
  const { colors } = useTheme();
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [editingRawData, setEditingRawData] = useState<any>(null);

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const { fetchComments, deleteComment, loading } = useComments();

  const [rawPostsMap, setRawPostsMap] = useState<Record<string, any>>({});
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const token = await getToken();
      const response = await api.get('/v1/admin/blog-posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!mountedRef.current) return;
      const postsData = unwrapList(response);

      const rawMap: Record<string, any> = {};
      const apiPosts = postsData.map((p: any) => {
        const id = String(p.id);
        rawMap[id] = p;
        let featuredImage = null;
        if (p.images && p.images.length > 0) {
          const featured = p.images.find((img: any) => img.is_primary) || p.images[0];
          featuredImage = featured?.image?.url || null;
        }
        return {
          id,
          title: p.title,
          slug: p.slug,
          category: p.category || 'Uncategorized',
          status: p.status || 'draft',
          date: p.published_at
            ? new Date(p.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : null,
          featured_image: featuredImage,
        };
      });
      setRawPostsMap(rawMap);
      setPosts(apiPosts);
    } catch (error) {
      if (!mountedRef.current) return;
      console.error('Failed to fetch posts:', error);
      Alert.alert('Error', 'Could not load blog posts.');
      setPosts([]);
    } finally {
      if (mountedRef.current) setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchPosts();
    } finally {
      if (mountedRef.current) setRefreshing(false);
    }
  }, []);

  const handleParentRefresh = useCallback(async () => {
    if (!mountedRef.current) return;
    await fetchPosts().finally(() => onRefresh?.());
  }, [onRefresh]);

  useEffect(() => {
    if (refreshingProp) {
      handleParentRefresh();
    }
  }, [refreshingProp]);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingPost(null);
    setModalVisible(true);
  };

  const openEditModal = (post: BlogPostItem) => {
    setModalMode("edit");
    setEditingPost(post);
    setEditingRawData(rawPostsMap[post.id] || null);
    setModalVisible(true);
  };

  const handleSubmit = async (post: BlogPostItem) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === post.id);
      return exists ? prev.map((p) => (p.id === post.id ? post : p)) : [post, ...prev];
    });
    setModalVisible(false);
    setEditingPost(null);
    setEditingRawData(null);
  };

  const togglePublish = async (post: BlogPostItem) => {
    try {
      const newStatus = post.status === "published" ? "draft" : "published";
      const token = await getToken();
      await api.put(`/v1/admin/blog-posts/${post.id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!mountedRef.current) return;
      setPosts(
        posts.map((p) =>
          p.id === post.id ? { ...p, status: newStatus } : p
        )
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update post status");
    }
  };

  const deletePost = async (post: BlogPostItem) => {
    Alert.alert("Delete Post", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const token = await getToken();
            await api.delete(`/v1/admin/blog-posts/${post.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!mountedRef.current) return;
            setPosts(posts.filter((p) => p.id !== post.id));
          } catch (error) {
            Alert.alert("Error", "Failed to delete post");
          }
        },
      },
    ]);
  };

  const filteredPosts = useMemo(() => {
    if (!query) return posts;
    return posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [posts, query]);

  const toggleComments = async (post: BlogPostItem) => {
    if (expandedPostId === post.id) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(post.id);
    if (commentsMap[post.id]) return;
    try {
      const comments = await fetchComments(post.slug);
      if (!mountedRef.current) return;
      setCommentsMap((prev) => ({
        ...prev,
        [post.id]: Array.isArray(comments) ? comments : [],
      }));
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not load comments");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await deleteComment(commentId);
      if (!mountedRef.current) return;
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
      }));
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to delete comment");
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}
        refreshControl={
          <RefreshControl refreshing={effectiveRefreshing} onRefresh={handleRefresh} />
        }>
        <View className="p-4">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Blog Posts
          </Text>
        </View>

        <View className="px-4 pb-4">
          <View
            className="flex-row items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: colors.background }}
          >
            <Search size={20} color={colors.secondaryText} />
            <TextInput
              placeholder="Search posts..."
              placeholderTextColor={colors.secondaryText}
              value={query}
              onChangeText={setQuery}
              className="flex-1"
              style={{ color: colors.text }}
            />
          </View>
        </View>

        <View className="px-4 pb-4">
          <TouchableOpacity
            onPress={openCreateModal}
            className="flex-row items-center justify-center gap-2 py-3 rounded-lg"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={20} color="#fff" />
            <Text className="font-semibold" style={{ color: "#fff" }}>
              Create Post
            </Text>
          </TouchableOpacity>
        </View>

        {loadingPosts ? (
          <View className="items-center justify-center py-8">
            <Text style={{ color: colors.secondaryText }}>Loading posts...</Text>
          </View>
        ) : filteredPosts.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text style={{ color: colors.secondaryText }}>No posts found</Text>
          </View>
        ) : (
          filteredPosts.map((post) => (
            <View key={post.id} className="px-4 pb-4">
              <BlogPostCard
                post={post}
                onTogglePublish={() => togglePublish(post)}
                onEdit={() => openEditModal(post)}
                onDelete={() => deletePost(post)}
              />

              <TouchableOpacity
                onPress={() => toggleComments(post)}
                className="mt-2 py-2"
              >
                <Text style={{ color: colors.primary }}>
                  {expandedPostId === post.id ? "Hide comments" : "View comments"}
                </Text>
              </TouchableOpacity>

              {expandedPostId === post.id && (
                <View className="mt-3 ml-2 border-l-2" style={{ borderColor: colors.border }}>
                  {loading ? (
                    <Text style={{ color: colors.secondaryText }} className="pl-3 py-2">
                      Loading comments...
                    </Text>
                  ) : (commentsMap[post.id] && commentsMap[post.id].length === 0) ? (
                    <Text style={{ color: colors.secondaryText }} className="pl-3 py-2">
                      No comments yet
                    </Text>
                  ) : (
                    (commentsMap[post.id] || []).map((comment) => (
                      <View key={comment.id} className="pl-3 py-2 border-b" style={{ borderColor: colors.border }}>
                        <Text style={{ color: colors.text }} className="font-semibold">
                          {comment.name || "Anonymous"}
                        </Text>
                        <Text style={{ color: colors.secondaryText }} className="text-sm">
                          {comment.comment}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteComment(post.id, comment.id)}
                          className="mt-1"
                        >
                          <Text style={{ color: "#ef4444" }} className="text-xs font-semibold">
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <PostFormModal
        visible={modalVisible}
        mode={modalMode}
        initialPost={editingPost}
        initialData={editingRawData}
        onClose={() => {
          setModalVisible(false);
          setEditingPost(null);
          setEditingRawData(null);
        }}
        onSubmit={handleSubmit}
      />
    </View>
  );
}