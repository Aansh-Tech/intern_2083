import { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import { useTheme } from "../../../context/useTheme";
import { useComment } from "../../../context/CommentContext";
import { blogs } from "../../../data/blogs";

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { addComment } = useComment();
  const router = useRouter();

  const blog = useMemo(() => blogs.find((b) => b.id === Number(id)), [id]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; comment?: string }>({});

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "Invalid email format";
    if (!comment.trim()) newErrors.comment = "Comment is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, comment]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    if (!blog) return;
    setLoading(true);
    await addComment({
      blogId: String(blog.id),
      blogTitle: blog.title,
      name,
      email,
      comment,
    });
    setName("");
    setEmail("");
    setComment("");
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }, [validate, blog, name, email, comment, addComment]);

  if (!blog) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-[18px] font-bold" style={{ color: colors.text }}>Blog not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4">
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={colors.primary} />
            <Text className="text-[15px] font-semibold" style={{ color: colors.primary }}>Back</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 pt-6 gap-2">
          <Text className="text-xs font-bold tracking-[2px]" style={{ color: colors.primary }}>
            {blog.date}
          </Text>
          <Text className="text-[32px] font-bold leading-[36px]" style={{ color: colors.text }}>
            {blog.title}
          </Text>
        </View>

        <View className="px-5 pt-6">
          <Text className="text-[15px] leading-[26px]" style={{ color: colors.secondaryText }}>
            This is a sample blog post about {blog.title.toLowerCase()}. In a full implementation, this
            would contain the complete article content with rich text, images, and code snippets.
          </Text>
        </View>

        <View className="px-5 pt-8">
          <Text className="text-[11px] font-bold tracking-[1.5px]" style={{ color: colors.primary }}>
            LEAVE A COMMENT
          </Text>
        </View>

        <View
          className="mx-5 mt-4 rounded-3xl border p-6 gap-5"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <CommentField
            label="Name"
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
            placeholder="Your name"
            autoCapitalize="words"
            error={errors.name}
            colors={colors}
          />
          <CommentField
            label="Email"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            colors={colors}
          />
          <CommentField
            label="Comment"
            value={comment}
            onChangeText={(t) => { setComment(t); setErrors((e) => ({ ...e, comment: undefined })); }}
            placeholder="Write your comment..."
            multiline
            error={errors.comment}
            colors={colors}
          />

          <TouchableOpacity
            className="flex-row items-center justify-center h-15 rounded-full gap-2"
            style={{ backgroundColor: colors.primary, height: 60, borderRadius: 999 }}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <Text className="text-base font-bold" style={{ color: colors.text }}>Submit Comment</Text>
                <Send size={18} color={colors.text} />
              </>
            )}
          </TouchableOpacity>

          {success && (
            <View
              className="rounded-2xl items-center py-3 px-4"
              style={{ backgroundColor: "#065F46" }}
            >
              <Text className="text-[14px] font-semibold" style={{ color: "#FFFFFF" }}>
                Comment submitted for review!
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function CommentField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  multiline,
  error,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  error?: string;
  colors: any;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-1.5">
      <Text
        className="text-[13px] font-semibold uppercase tracking-[0.8px]"
        style={{ color: colors.secondaryText }}
      >
        {label}
      </Text>
      <View
        className="rounded-[18px] border px-4"
        style={{
          backgroundColor: colors.background,
          borderColor: error ? "#EF4444" : focused ? colors.primary : colors.border,
        }}
      >
        <TextInput
          className="text-base"
          style={{
            color: colors.text,
            height: multiline ? 120 : 56,
            textAlignVertical: multiline ? "top" : "center",
            paddingTop: multiline ? 16 : 0,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error && <Text className="text-[#EF4444] text-xs mt-0.5">{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1 },
});
