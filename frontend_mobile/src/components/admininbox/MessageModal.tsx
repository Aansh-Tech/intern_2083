import { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import Avatar from "./Avatar";
import AppSheet from "../shared_components/AppSheet";
import { useTheme } from "../../context/useTheme";
import type { InboxMessage } from "../../types/inbox";

interface MessageModalProps {
  message: InboxMessage | null;
  visible: boolean;
  onClose: () => void;
  onDone: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageModal({
  message,
  visible,
  onClose,
  onDone,
  onDelete,
}: MessageModalProps) {
  const { colors } = useTheme();

  const handleReply = useCallback(() => {
    if (!message) return;
    Linking.openURL(`mailto:${message.email}`);
  }, [message]);

  const handleDone = useCallback(() => {
    if (!message) return;
    onDone(message.id);
    onClose();
  }, [message, onDone, onClose]);

  const handleDelete = useCallback(() => {
    if (!message) return;
    onDelete(message.id);
    onClose();
  }, [message, onDelete, onClose]);

  if (!message) return null;

  return (
    <AppSheet
      visible={visible}
      onClose={onClose}
      title="Message"
      footer={
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 h-[50px] rounded-full border items-center justify-center"
            style={{ borderColor: colors.border }}
            onPress={handleReply}
            activeOpacity={0.7}
          >
            <Text
              className="text-[15px] font-semibold"
              style={{ color: colors.secondaryText }}
            >
              Reply
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 h-[50px] rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleDone}
            activeOpacity={0.7}
          >
            <Text
              className="text-[15px] font-bold"
              style={{ color: colors.text }}
            >
              Done
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-[50px] w-[50px] rounded-full items-center justify-center"
            style={{ backgroundColor: "#EF4444" }}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text className="text-[15px] font-bold" style={{ color: "#FFFFFF" }}>
              X
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View className="items-center mb-5">
        <Avatar name={message.name} size={56} />
      </View>

        <Text
          className="text-[20px] font-bold text-center"
          style={{ color: colors.text }}
        >
          {message.name}
        </Text>
        <Text
          className="text-[14px] text-center mt-0.5"
          style={{ color: colors.secondaryText }}
        >
          {message.email}
        </Text>

        <View className="flex-row items-center justify-between mt-5">
          <Text
            className="text-[15px] font-semibold flex-1"
            style={{ color: colors.text }}
          >
            {message.subject}
          </Text>
          <Text
            className="text-[12px] ml-2"
            style={{ color: colors.secondaryText }}
          >
            {formatFullDate(message.date)}
          </Text>
        </View>

        <View
          className="rounded-2xl border p-4 mt-4"
          style={{ backgroundColor: colors.background, borderColor: colors.border }}
        >
          <Text
            className="text-[14px] leading-[22px]"
            style={{ color: colors.text }}
          >
            {message.message}
          </Text>
        </View>
    </AppSheet>
  );
}