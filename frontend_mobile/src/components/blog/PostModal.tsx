import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Clock } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";

interface Post {
  id: string;
  category?: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  body: string[];
  gradient: [string, string, ...string[]];
}

interface PostModalProps {
  post: Post | null;
  visible: boolean;
  onClose: () => void;
}

export default function PostModal({ post, visible, onClose }: PostModalProps) {
  const { colors } = useTheme();

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={post.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ height: 220, justifyContent: "flex-start", alignItems: "flex-end", padding: 16 }}
          >
            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-black/35 items-center justify-center"
              activeOpacity={0.8}
              onPress={onClose}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>

          <View className="p-5 gap-3.5">
            <View className="flex-row items-center flex-wrap gap-2.5">
              {post.category ? (
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
              ) : null}
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
              className="text-[26px] font-bold"
              style={{ color: colors.text }}
            >
              {post.title}
            </Text>

            {post.body.map((paragraph, i) => (
              <Text
                key={i}
                className="text-base leading-6"
                style={{ color: colors.secondaryText }}
              >
                {paragraph}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}