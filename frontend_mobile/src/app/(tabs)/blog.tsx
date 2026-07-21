import { useState, useEffect, useCallback, useRef } from "react";
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Text, Image, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/useTheme";
import Header from "../../components/homepage/Header";
import PostModal from "../../components/blog/PostModal";
import api from "../../services/api";


console.log = () => {};
console.info = () => {};
console.debug = () => {};

interface Post {
  id: string;
  blogId: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  body: string[];
  gradient: [string, string];
  featured_image?: string | null;
  author?: string | null;
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

export default function BlogScreen() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchPosts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await api.get('/v1/blog-posts');
      if (!mountedRef.current) return;
      const postsData = unwrapList(response);
      const published = postsData.filter((p: any) => p.status === "published");

      const formattedPosts = published.map((p: any) => {
        let featuredImage = null;
        if (p.images && p.images.length > 0) {
          const featured = p.images.find((img: any) => img.is_primary) || p.images[0];
          featuredImage = featured?.image?.url || null;
        }
        return {
          id: String(p.id),
          blogId: String(p.id),
          slug: p.slug,
          title: p.title,
          category: p.category || 'Uncategorized',
          date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date',
          readTime: '3 min read',
          excerpt: p.excerpt || p.content?.substring(0, 100) || '',
          body: p.content?.split('\n') || [],
          gradient: ['#6366f1', '#8b5cf6'] as [string, string],
          featured_image: featuredImage,
          author: p.author?.name || null,
        };
      });
      setPosts(formattedPosts);
    } catch (error) {
      if (!mountedRef.current) return;
      console.error('Failed to fetch posts:', error);
      Alert.alert('Error', 'Could not load blog posts.');
      setPosts([]);
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  const openPost = (post: Post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4" style={{ color: colors.secondaryText }}>Loading posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header />

        <View className="px-5 pt-8 gap-2">
          <Text className="text-xs font-bold tracking-[2px]" style={{ color: colors.primary }}>
            BLOG
          </Text>
          <Text className="text-[40px] font-bold leading-[44px]" style={{ color: colors.text }}>
            Blog
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.secondaryText }}>
            Notes, working sketches, and the occasional strong opinion on interface craft.
          </Text>
        </View>

        {posts.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text style={{ color: colors.secondaryText }}>No posts found.</Text>
          </View>
        ) : (
          <View className="px-5 pb-10 gap-4">
            {posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                onPress={() => openPost(post)}
                className="p-4 rounded-2xl border"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
                activeOpacity={0.7}
              >
                {post.featured_image && (
                  <Image
                    source={{ uri: post.featured_image }}
                    className="w-full h-40 rounded-xl mb-3"
                    resizeMode="cover"
                  />
                )}
                <Text className="text-sm font-medium uppercase tracking-wide" style={{ color: colors.primary }}>
                  {post.category}
                </Text>
                <Text className="text-xl font-bold mt-1" style={{ color: colors.text }}>
                  {post.title}
                </Text>
                <Text className="text-sm mt-1" style={{ color: colors.secondaryText }} numberOfLines={2}>
                  {post.excerpt}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-xs" style={{ color: colors.secondaryText }}>
                    {post.date} · {post.readTime}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <PostModal
        post={selectedPost}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
