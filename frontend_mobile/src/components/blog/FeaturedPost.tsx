import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Clock, ArrowUpRight } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface FeaturedPostProps {
  post: {
    id: string;
    category: string;
    date: string;
    readTime: string;
    title: string;
    excerpt: string;
    gradient: [string, string, ...string[]];
  };
  onPress: () => void;
}

export default function FeaturedPost({ post, onPress }: FeaturedPostProps) {
  const { colors } = useTheme();

  return (
    <View
      className="mx-5 mt-6 rounded-[20px] border overflow-hidden"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <LinearGradient
        colors={post.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: "100%", aspectRatio: 2.85 }}
      />

      <View className="p-5 gap-2">
        <View className="flex-row items-center flex-wrap gap-2.5">
          <View
            className="px-3 py-[5px] rounded-full"
            style={{ backgroundColor: colors.primary + "26" }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: colors.primary }}
            >
              {post.category}
            </Text>
          </View>
          <Text
            className="text-[13px]"
            style={{ color: colors.secondaryText }}
          >
            {post.date}
          </Text>
          <View className="flex-row items-center gap-1">
            <Clock size={13} color={colors.secondaryText} />
            <Text
              className="text-[13px]"
              style={{ color: colors.secondaryText }}
            >
              {post.readTime}
            </Text>
          </View>
        </View>

        <Text
          className="text-[22px] font-bold mt-1"
          style={{ color: colors.text }}
        >
          {post.title}
        </Text>
        <Text
          className="text-[15px] leading-[22px]"
          style={{ color: colors.secondaryText }}
        >
          {post.excerpt}
        </Text>

        <TouchableOpacity
          className="flex-row items-center gap-1.5 mt-1.5"
          activeOpacity={0.7}
          onPress={onPress}
        >
          <Text
            className="text-[15px] font-semibold"
            style={{ color: colors.primary }}
          >
            Read more
          </Text>
          <ArrowUpRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}