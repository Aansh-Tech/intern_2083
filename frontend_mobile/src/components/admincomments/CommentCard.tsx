import { memo, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Check, Ban, Trash2 } from "lucide-react-native";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import { useTheme } from "../../context/useTheme";
import type { Comment } from "../../types/comment";

interface CommentCardProps {
  comment: Comment;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatRelativeDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const mins = Math.floor(diff / (1000 * 60));
      return `${mins}m ago`;
    }
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return "1d ago";
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return "";
  }
}

function CommentCard({ comment, onApprove, onReject, onDelete }: CommentCardProps) {
  const { colors } = useTheme();

  // ---- Safe fallback values ----
  const name = comment?.name ?? "Anonymous";
  const blogTitle = comment?.blogTitle ?? "Unknown Post";
  const content = comment?.comment ?? "";
  const status = comment?.status ?? "pending";
  const createdAt = comment?.createdAt ?? new Date().toISOString();
  const id = comment?.id ?? "";

  const handleApprove = useCallback(async () => {
    if (!id) return;
    try {
      await onApprove(id);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to approve comment.");
    }
  }, [id, onApprove]);

  const handleReject = useCallback(async () => {
    if (!id) return;
    try {
      await onReject(id);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reject comment.");
    }
  }, [id, onReject]);

  const handleDelete = useCallback(() => {
    if (!id) return;
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await onDelete(id);
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete comment.");
            }
          },
        },
      ]
    );
  }, [id, onDelete]);

  return (
    <View
      className="rounded-3xl border p-4 gap-3"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <View className="flex-row gap-3">
        <Avatar name={name} />
        <View className="flex-1 gap-1">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-[15px] font-bold flex-1"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              className="text-[11px] font-medium ml-2"
              style={{ color: colors.secondaryText }}
            >
              {formatRelativeDate(createdAt)}
            </Text>
          </View>
          <Text
            className="text-[12px] font-medium"
            style={{ color: colors.primary }}
            numberOfLines={1}
          >
            on “{blogTitle}”
          </Text>
          <Text
            className="text-[13px] leading-[18px] mt-1"
            style={{ color: colors.secondaryText }}
            numberOfLines={2}
          >
            {content}
          </Text>
        </View>
      </View>

      <StatusBadge status={status} />

      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 h-[42px] rounded-full flex-row items-center justify-center gap-1.5"
          style={{ backgroundColor: "#10B98120" }}
          onPress={handleApprove}
          activeOpacity={0.7}
        >
          <Check size={16} color="#10B981" />
          <Text className="text-[13px] font-semibold" style={{ color: "#10B981" }}>
            Approve
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-[42px] rounded-full flex-row items-center justify-center gap-1.5"
          style={{ backgroundColor: "#F59E0B20" }}
          onPress={handleReject}
          activeOpacity={0.7}
        >
          <Ban size={16} color="#F59E0B" />
          <Text className="text-[13px] font-semibold" style={{ color: "#F59E0B" }}>
            Reject
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="h-[42px] w-[42px] rounded-full items-center justify-center"
          style={{ backgroundColor: "#EF444420" }}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(CommentCard);