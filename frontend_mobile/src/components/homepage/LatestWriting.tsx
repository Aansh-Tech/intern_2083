import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import BlogCard from "./BlogCard";
import SectionTitle from "./SectionTitle";
import { useTheme } from "../../context/useTheme";
import api from "../../services/api";
import { useResponsiveContainer, useResponsiveColumns, gridCellStyle } from "../../utils/responsive";

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
  const mountedRef = useRef(true);
  const headerContainer = useResponsiveContainer();
  const listContainer = useResponsiveContainer();
  const columns = useResponsiveColumns(320, 1);

  useEffect(() => {
    mountedRef.current = true;
    const fetch = async () => {
      try {
        const response = await api.get("/v1/blog-posts");
        if (!mountedRef.current) return;
        let items = unwrapList(response);
        items = items.filter((p: any) => p.status === "published");
        setBlogs(items.slice(0, 3));
      } catch (err) {
        if (!mountedRef.current) return;
        console.error("Failed to fetch blogs for homepage:", err);
        setBlogs([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <View className="pt-14 pb-6">
      <View style={[styles.header, headerContainer]}>
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
      <View style={[styles.list, listContainer]}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : blogs.length === 0 ? (
          <Text style={{ color: colors.secondaryText }}>No posts yet.</Text>
        ) : (
          blogs.map((blog) => (
            <View key={blog.id} style={gridCellStyle(columns, 16)}>
              <BlogCard
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
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 32,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
});
