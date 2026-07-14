// src/components/blog/PostModal.tsx
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Clock } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useState } from "react";
import { useComments } from "../../hooks/useComments";

interface Post {
  id: string;          
  blogId: string;      
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
  const { postComment, loading } = useComments();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  if (!post) return null;

  const handleSubmitComment = async () => {
    if (!name.trim() || !email.trim() || !content.trim()) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    console.log("Submitting comment with blog_post_id:", post.blogId); 

    try {
      await postComment({
        blog_post_id: post.blogId,  
        name: name.trim(),
        email: email.trim(),
        content: content.trim(),
      });
      setName("");
      setEmail("");
      setContent("");
      Alert.alert("Thank you!", "Your comment has been submitted for review.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not submit comment.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
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

          {/* Comment form */}
          <View className="px-5 pb-8 gap-4">
            <Text className="text-lg font-bold" style={{ color: colors.text }}>Leave a comment</Text>

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
              disabled={loading}
              className="py-3 rounded-full"
              style={{ backgroundColor: colors.primary, opacity: loading ? 0.5 : 1 }}
            >
              <Text className="text-white font-semibold text-center">
                {loading ? "Submitting..." : "Submit comment"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}