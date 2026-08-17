import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Clock, Send } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/useTheme";
import { usePopup } from "../Popup";
import { useState, useEffect, useCallback, useRef } from "react";
import { useComments } from "../../hooks/useComments";
import api from "../../services/api";
import { isTablet } from "../../utils/responsive";


interface Post {
  id: string;
  slug: string;
  blogId?: string;
  category?: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  body: string[];
  gradient: [string, string, ...string[]];
  featured_image?: string | null;
  author?: string | null;
}

interface PostModalProps {
  post: Post | null;
  visible: boolean;
  onClose: () => void;
}

const unwrapItem = (response: any): any => {
  if (response.data?.data?.data) return response.data.data.data;
  if (response.data?.data) return response.data.data;
  return response.data;
};

export default function PostModal({ post, visible, onClose }: PostModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { showModal } = usePopup();
  const { postComment, fetchComments, loading: submitting } = useComments();
  const mountedRef = useRef(true);
  const tablet = isTablet(windowWidth);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [detailPost, setDetailPost] = useState<Post | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (visible && post) {
      setDetailPost(null);
      loadDetail(post);
    }
  }, [visible, post?.slug]);

  const loadDetail = async (p: Post) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/v1/blog-posts/${p.slug}`);
      if (!mountedRef.current) return;
      const data = unwrapItem(response);
      const featuredImage = data.images && data.images.length > 0
        ? (data.images.find((img: any) => img.is_primary) || data.images[0])?.image?.url
        : null;
      setDetailPost({
        id: String(data.id),
        blogId: String(data.id),
        slug: data.slug,
        title: data.title || p.title,
        category: data.category || p.category || "Uncategorized",
        date: data.published_at
          ? new Date(data.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : p.date,
        readTime: "3 min read",
        excerpt: data.excerpt || "",
        body: data.content ? data.content.split("\n") : p.body,
        gradient: p.gradient,
        featured_image: featuredImage,
        author: data.author?.name || null,
      } as any);
    } catch (err) {
      if (!mountedRef.current) return;
      console.error("Failed to fetch post detail, using list data:", err);
      setDetailPost(p);
    } finally {
      if (mountedRef.current) setLoadingDetail(false);
    }
  };

  const loadComments = useCallback(async (slug: string) => {
    setLoadingComments(true);
    try {
      const data = await fetchComments(slug);
      if (!mountedRef.current) return;
      const approved = data.filter((c: any) => {
        const s = String(c.status).toLowerCase();
        return s === "approved" || s === "1" || s === "active";
      });
      setComments(approved);
    } catch (error) {
      if (!mountedRef.current) return;
      console.error("[PostModal] Failed to load comments:", error);
      setComments([]);
    } finally {
      if (mountedRef.current) setLoadingComments(false);
    }
  }, [fetchComments]);

  const displaySlug = (detailPost || post)?.slug;

  useEffect(() => {
    if (visible && displaySlug) {
      loadComments(displaySlug);
    }
  }, [visible, displaySlug, loadComments]);

  const displayPost = detailPost || post;
  if (!displayPost) return null;

  const handleSubmitComment = async () => {
    if (!name.trim() || !email.trim() || !content.trim()) {
      showModal({
        type: "error",
        title: "Missing information",
        message: "All fields are required.",
        primaryText: "OK",
      });
      return;
    }

    const blogPostId = displayPost.blogId || displayPost.id;
    const currentSlug = displayPost.slug;

    try {
      await postComment({
        blog_post_id: blogPostId,
        name: name.trim(),
        email: email.trim(),
        content: content.trim(),
      });
      if (!mountedRef.current) return;
      setName("");
      setEmail("");
      setContent("");
      showModal({
        type: "success",
        title: "Thank you!",
        message: "Your comment is pending review.",
        primaryText: "OK",
      });
      if (currentSlug) {
        await loadComments(currentSlug);
      }
    } catch (err: any) {
      showModal({
        type: "error",
        title: "Something went wrong",
        message: err?.message || "Could not submit comment.",
        primaryText: "OK",
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }} onPress={onClose}>
          <Pressable style={{ flex: 1 }} onPress={() => {}}>
            <View
              style={{
                flex: 1,
                marginTop: tablet ? 32 : 0,
                marginBottom: tablet ? 24 : 0,
                paddingBottom: insets.bottom + 8,
                maxWidth: tablet ? Math.min(windowWidth - 48, 600) : undefined,
                alignSelf: "center",
                width: tablet ? "100%" : undefined,
              }}
            >
              <View style={styles.sheetShadow}>
                <View style={[styles.sheet, { backgroundColor: colors.card }]}>
                  <View style={styles.grabberWrap}>
                    <View style={[styles.grabber, { backgroundColor: colors.border }]} />
                  </View>
                  {loadingDetail ? (
                    <View className="flex-1 justify-center items-center">
                      <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                  ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={displayPost.gradient}
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

            {displayPost.featured_image && (
              <Image
                source={{ uri: displayPost.featured_image }}
                className="w-full h-48"
                resizeMode="cover"
              />
            )}

            <View className="p-5 gap-3.5">
              <View className="flex-row items-center flex-wrap gap-2.5">
                {displayPost.category ? (
                  <View className="px-3 py-[5px] rounded-full" style={{ backgroundColor: colors.primary + "26" }}>
                    <Text className="text-xs font-bold" style={{ color: colors.primary }}>{displayPost.category}</Text>
                  </View>
                ) : null}
                <Text className="text-[13px]" style={{ color: colors.secondaryText }}>{displayPost.date}</Text>
                <View className="flex-row items-center gap-1">
                  <Clock size={13} color={colors.secondaryText} />
                  <Text className="text-[13px]" style={{ color: colors.secondaryText }}>{displayPost.readTime}</Text>
                </View>
              </View>

              <Text className="text-[26px] font-bold" style={{ color: colors.text }}>{displayPost.title}</Text>

              {displayPost.author ? (
                <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                  By {displayPost.author}
                </Text>
              ) : null}

              {displayPost.body.map((paragraph, i) => (
                <Text key={i} className="text-base leading-6" style={{ color: colors.secondaryText }}>
                  {paragraph}
                </Text>
              ))}
            </View>

            <View className="px-5 pb-5 gap-4">
              <Text className="text-lg font-bold" style={{ color: colors.text }}>
                Comments ({comments.length})
              </Text>

              {loadingComments ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : comments.length === 0 ? (
                <Text style={{ color: colors.secondaryText }}>No comments yet.</Text>
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
            )}
              </View>
            </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheetShadow: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "transparent",
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: -6 },
    elevation: 28,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  grabberWrap: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 2,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});
