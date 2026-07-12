import { useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { ArrowUpRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import Header from "../../../components/homepage/Header";
import { useTheme } from "../../../context/useTheme";
import { blogs } from "../../../data/blogs";

export default function BlogListingScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const handlePress = useCallback(
    (id: number) => {
      router.push(`/(tabs)/blog/${id}` as any);
    },
    [router]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header />

        <View className="px-5 pt-8 gap-2">
          <Text className="text-xs font-bold tracking-[2px]" style={{ color: colors.primary }}>
            BLOG
          </Text>
          <Text className="text-[40px] font-bold leading-[44px]" style={{ color: colors.text }}>
            Writings
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.secondaryText }}>
            Thoughts on design, engineering, and building products.
          </Text>
        </View>

        <View className="px-5 pt-6 gap-4 pb-8">
          {blogs.map((blog) => (
            <TouchableOpacity
              key={blog.id}
              activeOpacity={0.8}
              onPress={() => handlePress(blog.id)}
              className="rounded-[24px] border p-6"
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
            >
              <View className="flex-row justify-between items-start">
                <Text
                  className="text-[12px] font-semibold uppercase tracking-[1px]"
                  style={{ color: colors.secondaryText }}
                >
                  {blog.date}
                </Text>
                <ArrowUpRight size={18} color={colors.secondaryText} />
              </View>
              <Text
                className="mt-5 text-[20px] font-semibold leading-8"
                style={{ color: colors.text }}
                numberOfLines={3}
              >
                {blog.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1 },
});
