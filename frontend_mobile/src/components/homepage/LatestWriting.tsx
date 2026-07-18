import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import BlogCard from "./BlogCard";
import SectionTitle from "./SectionTitle";
import { useTheme } from "../../context/useTheme";
import api from "../../services/api";

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

interface HomepageBlog {
  id: number;
  title: string;
  slug: string;
  published_at: string | null;
}

export default function LatestWriting() {
  const { colors } = useTheme();
  const router = useRouter();
  const [blogs, setBlogs] = useState<HomepageBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await api.get("/v1/blog-posts");
        let items = unwrapList(response);
        items = items.filter((p: any) => p.status === "published");
        setBlogs(items.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch blogs for homepage:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <View className="pt-14 pb-6">
      <View className="flex-row justify-between items-start px-5">
        <SectionTitle subtitle="BLOG" title="Latest writing" />
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/blog")}
          activeOpacity={0.7}
        >
          <Text className="text-[15px] font-semibold" style={{ color: colors.primary }}>
            All →
          </Text>
        </TouchableOpacity>
      </View>
      <View className="px-5 pt-8 gap-4">
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : blogs.length === 0 ? (
          <Text style={{ color: colors.secondaryText }}>No posts yet.</Text>
        ) : (
          blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              date={
                blog.published_at
                  ? new Date(blog.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Draft"
              }
              title={blog.title}
              link={`/(tabs)/blog`}
            />
          ))
        )}
      </View>
    </View>
  );
}
