// src/components/blog/PostModal.tsx
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Clock, Send } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useState, useEffect } from "react";
import { useComments } from "../../hooks/useComments";

interface Post {
  id: string;
  slug: string;          // required for fetching comments
  blogId?: string;       // numeric ID for comment submission (fallback to id if not provided)
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
  const { postComment, fetchComments, loading: submitting } = useComments();

  // Comment form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Fetch approved comments when modal opens
  useEffect(() => {
    if (visible && post?.slug) {
      const loadComments = async () => {
        setLoadingComments(true);
        try {
          const data = await fetchComments(post.slug);
          // data is an array; filter only approved
          const approved = data.filter((c: any) => c.status === "approved");
          setComments(approved);
        } catch (error) {
          console.error("Failed to load comments:", error);
          setComments([]);
        } finally {
          setLoadingComments(false);
        }
      };
      loadComments();
    }
  }, [visible, post?.slug]);

  if (!post) return null;

  const handleSubmitComment = async () => {
    if (!name.trim() || !email.trim() || !content.trim()) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    // Use blogId if available, else fallback to id (numeric)
    const blogPostId = post.blogId || post.id;

    try {
      await postComment({
        blog_post_id: blogPostId,
        name: name.trim(),
        email: email.trim(),
        content: content.trim(),
      });
      setName("");
      setEmail("");
      setContent("");
      Alert.alert("Thank you!", "Your comment is pending review.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not submit comment.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header gradient */}
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

          {/* Post content */}
          <View className="p-5 gap-3.5">
            <View className="flex-row items-center flex-wrap gap-2.5">
              {post.category ? (
                <View className="px-3 py-[5px] rounded-full" style={{ backgroundColor: colors.primary + "26" }}>
                  <Text className="text-xs font-bold" style={{ color: colors.primary }}>{post.category}</Text>
                </View>
              ) : null}
              <Text className="text-[13px]" style={{ color: colors.secondaryText }}>{post.date}</Text>
              <View className="flex-row items-center gap-1">
                <Clock size={13} color={colors.secondaryText} />
                <Text className="text-[13px]" style={{ color: colors.secondaryText }}>{post.readTime}</Text>
              </View>
            </View>

            <Text className="text-[26px] font-bold" style={{ color: colors.text }}>{post.title}</Text>

            {post.body.map((paragraph, i) => (
              <Text key={i} className="text-base leading-6" style={{ color: colors.secondaryText }}>
                {paragraph}
              </Text>
            ))}
          </View>

          {/* ----- COMMENTS SECTION ----- */}
          <View className="px-5 pb-5 gap-4">
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              Comments ({comments.length})
            </Text>

            {loadingComments ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : comments.length === 0 ? (
              <Text style={{ color: colors.secondaryText }}>No approved comments yet.</Text>
            ) : (
              comments.map((comment) => (
                <View
                  key={comment.id}
                  className="border-b pb-3 mb-2"
                  style={{ borderBottomColor: colors.border }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold" style={{ color: colors.text }}>
                      {comment.name}
                    </Text>
                    <Text className="text-xs" style={{ color: colors.secondaryText }}>
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </Text>
                  </View>
                  <Text style={{ color: colors.text, marginTop: 4 }}>{comment.comment}</Text>
                </View>
              ))
            )}

            {/* Comment form */}
            <View className="mt-4 gap-3">
              <Text className="text-base font-semibold" style={{ color: colors.text }}>
                Leave a comment
              </Text>

              <TextInput
                className="border rounded-full px-4 py-2.5"
                style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
                placeholder="Your name"
                placeholderTextColor={colors.secondaryText}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                className="border rounded-full px-4 py-2.5"
                style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.card }}
                placeholder="Your email"
                placeholderTextColor={colors.secondaryText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                className="border rounded-xl px-4 py-2.5"
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.card,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
                placeholder="Write your comment..."
                placeholderTextColor={colors.secondaryText}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity
                onPress={handleSubmitComment}
                disabled={submitting}
                className="py-3 rounded-full"
                style={{ backgroundColor: colors.primary, opacity: submitting ? 0.5 : 1 }}
              >
                <Text className="text-white font-semibold text-center">
                  {submitting ? "Submitting..." : "Submit comment"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}