// src/app/blog.tsx
import { useState, useEffect } from "react";
import { View, ScrollView, Alert, ActivityIndicator, Text } from "react-native";
import Header from "../../components/homepage/Header";
import JournalHeader from "../../components/blog/BlogHeader";
import FeaturedPost from "../../components/blog/FeaturedPost";
import PostList from "../../components/blog/PostList";
import PostModal from "../../components/blog/PostModal";
import { useTheme } from "../../context/useTheme";
import api from "../../services/api";

interface BlogPost {
  id: string;          
  blogId: string;      
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  body: string[];
  gradient: [string, string];
}

export default function JournalScreen() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/v1/blog-posts');
        console.log('Blog API response:', response);

        
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

        const formattedPosts = postsData.map((p: any) => ({
          id: p.slug,                       
          blogId: String(p.id),              
          category: p.category || 'Uncategorized',
          date: p.published_at
            ? new Date(p.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Unknown date',
          readTime: '3 min read',            
          title: p.title,
          excerpt: p.excerpt || p.content?.substring(0, 100) || '',
          body: p.content?.split('\n') || [],
          gradient: ['#6366f1', '#8b5cf6'],   
        }));

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

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const closePost = () => {
    setModalVisible(false);
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
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="pb-10">
          <JournalHeader />
          <FeaturedPost post={posts[0]} onPress={() => openPost(posts[0])} />
          <PostList posts={posts.slice(1)} onSelectPost={(post) => openPost(post as BlogPost)} />
        </View>
      </ScrollView>

      <PostModal post={selectedPost} visible={modalVisible} onClose={closePost} />
    </View>
  );
}