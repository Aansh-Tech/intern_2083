import { memo, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import { useTheme } from "../../context/useTheme";
import type { InboxMessage } from "../../types/inbox";

interface MessageCardProps {
  message: InboxMessage;
  onPress: (message: InboxMessage) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    const mins = Math.floor(diff / (1000 * 60));
    return `${mins}m`;
  }
  if (hours < 24) return `${hours}h`;
  if (hours < 48) return "1d";

  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  return `${month} ${day}`;
}

function MessageCard({ message, onPress }: MessageCardProps) {
  const { colors } = useTheme();

  const handlePress = useCallback(() => onPress(message), [onPress, message]);

  return (
    <TouchableOpacity
      className="flex-row rounded-3xl border p-4 gap-3"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Avatar name={message.name} />
      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 flex-1">
            <Text
              className="text-[15px] font-bold"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {message.name}
            </Text>
            {!message.isRead && (
              <View
                className="w-[8px] h-[8px] rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </View>
          <Text
            className="text-[11px] font-medium ml-2"
            style={{ color: colors.secondaryText }}
          >
            {formatDate(message.date)}
          </Text>
        </View>
        <Text
          className="text-[13px] font-semibold"
          style={{ color: colors.primary }}
          numberOfLines={1}
        >
          {message.subject}
        </Text>
        <Text
          className="text-[13px] leading-[18px]"
          style={{ color: colors.secondaryText }}
          numberOfLines={2}
        >
          {message.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(MessageCard);
