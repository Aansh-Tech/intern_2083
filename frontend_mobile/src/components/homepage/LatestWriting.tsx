import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import BlogCard from "./BlogCard";
import SectionTitle from "./SectionTitle";
import { blogs } from "../../data/blogs";
import { useTheme } from "../../context/useTheme";

export default function LatestWriting() {
  const { colors } = useTheme();
  const router = useRouter();

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
        {blogs.map((blog) => (
          <BlogCard key={blog.id} date={blog.date} title={blog.title} link={blog.link} />
        ))}
      </View>
    </View>
  );
}