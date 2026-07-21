import { memo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { X, MessageSquare, Mail } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useNotifications } from "../../context/NotificationContext";

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function NotificationIcon({
  type,
  read,
}: {
  type: "contact" | "comment";
  read: boolean;
}) {
  const { colors } = useTheme();
  if (type === "contact") {
    return (
      <View
        className="w-[36px] h-[36px] rounded-full items-center justify-center"
        style={{ backgroundColor: read ? "rgba(139,131,255,0.08)" : "rgba(139,131,255,0.18)" }}
      >
        <Mail size={16} color={read ? colors.secondaryText : colors.primary} />
      </View>
    );
  }
  return (
    <View
      className="w-[36px] h-[36px] rounded-full items-center justify-center"
      style={{ backgroundColor: read ? "rgba(139,131,255,0.08)" : "rgba(139,131,255,0.18)" }}
    >
      <MessageSquare size={16} color={read ? colors.secondaryText : colors.primary} />
    </View>
  );
}

const NotificationCard = memo(function NotificationCard({
  title,
  subtitle,
  createdAt,
  read,
  type,
}: {
  title: string;
  subtitle: string;
  createdAt: string;
  read: boolean;
  type: "contact" | "comment";
}) {
  const { colors } = useTheme();
  return (
    <View
      className="flex-row items-start gap-3 rounded-2xl border px-4 py-3"
      style={{
        backgroundColor: read ? colors.card : "rgba(139,131,255,0.06)",
        borderColor: colors.border,
      }}
    >
      <NotificationIcon type={type} read={read} />
      <View className="flex-1 gap-0.5">
        <Text
          className="text-[13px]"
          style={{
            color: colors.text,
            fontWeight: read ? "500" : "700",
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          className="text-[12px]"
          style={{ color: colors.secondaryText }}
          numberOfLines={2}
        >
          {subtitle}
        </Text>
        <Text
          className="text-[11px]"
          style={{ color: colors.secondaryText, opacity: 0.6 }}
        >
          {relativeTime(createdAt)}
        </Text>
      </View>
    </View>
  );
});

interface NotificationPanelProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationPanel({
  visible,
  onClose,
}: NotificationPanelProps) {
  const { colors } = useTheme();
  const { notifications, markAllAsRead, refreshNotifications } =
    useNotifications();

  useEffect(() => {
    if (visible) {
      refreshNotifications();
      markAllAsRead();
    }
  }, [visible, refreshNotifications, markAllAsRead]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View
            className="mx-4 mt-2 rounded-[20px] border p-5"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              maxHeight: "60%",
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-[18px] font-bold"
                style={{ color: colors.text }}
              >
                Notifications
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <X size={20} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
              <View className="py-10 items-center">
                <Text
                  className="text-[14px]"
                  style={{ color: colors.secondaryText }}
                >
                  No notifications yet.
                </Text>
              </View>
            ) : (
              <ScrollView
                className="gap-3"
                contentContainerStyle={{ paddingBottom: 4 }}
                showsVerticalScrollIndicator={false}
              >
                {notifications.map((n) => (
                  <NotificationCard
                    key={n.id}
                    title={n.title}
                    subtitle={n.subtitle}
                    createdAt={n.createdAt}
                    read={n.read ?? false}
                    type={n.type}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
