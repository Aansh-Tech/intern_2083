import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Text, Image } from "react-native";
import { useTheme } from "../../context/useTheme";
import PostModal from "../../components/blog/PostModal";
import api from "../../services/api";

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
}

export default function BlogScreen() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/v1/blog-posts');
        let postsData = [];
        if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          postsData = response.data.data.data;
        } else if (Array.isArray(response.data)) {
          postsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          postsData = response.data.data;
        } else {
          throw new Error('Unexpected API response');
        }

        const formattedPosts = postsData.map((p: any) => {
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
            gradient: ['#6366f1', '#8b5cf6'],
            featured_image: featuredImage,
          };
        });
        setPosts(formattedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        Alert.alert('Error', 'Could not load blog posts.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const openPost = (post: Post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4" style={{ color: colors.secondaryText }}>Loading posts...</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.secondaryText }}>No posts found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-5 pt-6 pb-3">
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>
            Blog
          </Text>
          <Text style={{ color: colors.secondaryText, marginTop: 4 }}>
            Notes, working sketches, and the occasional strong opinion on interface craft.
          </Text>
        </View>

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
      </ScrollView>

      <PostModal
        post={selectedPost}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}