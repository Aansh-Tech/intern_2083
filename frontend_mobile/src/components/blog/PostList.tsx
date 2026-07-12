import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/useTheme";

interface Post {
  id: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  gradient: [string, string, ...string[]];
}

interface PostListProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export default function PostList({ posts, onSelectPost }: PostListProps) {
  const { colors } = useTheme();

  return (
    <View className="pt-8">
      <Text
        className="text-xs font-bold tracking-[1.5px] px-5 mb-3.5"
        style={{ color: colors.secondaryText }}
      >
        MORE POSTS
      </Text>

      <View className="px-5 gap-3.5">
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            className="flex-row gap-3.5 p-3.5 rounded-[18px] border"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            activeOpacity={0.75}
            onPress={() => onSelectPost(post)}
          >
            <LinearGradient
              colors={post.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-16 h-16 rounded-[14px]"
            />

            <View className="flex-1 gap-1 justify-center">
              <Text
                className="text-xs"
                style={{ color: colors.secondaryText }}
              >
                {post.date} · {post.readTime}
              </Text>
              <Text
                className="text-base font-bold"
                style={{ color: colors.text }}
                numberOfLines={1}
              >
                {post.title}
              </Text>
              <Text
                className="text-[13px] leading-[18px]"
                style={{ color: colors.secondaryText }}
                numberOfLines={2}
              >
                {post.excerpt}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}