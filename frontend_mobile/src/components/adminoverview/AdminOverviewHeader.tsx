import { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LogOut, Sun, Moon, Bell } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useProfile } from "../../context/ProfileContext";
import { useNotifications } from "../../context/NotificationContext";

interface AdminOverviewHeaderProps {
  onSignOut: () => void;
  onNotificationPress: () => void;
}

function AdminOverviewHeader({ onSignOut, onNotificationPress }: AdminOverviewHeaderProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { profile, photoTimestamp } = useProfile();
  const { unreadCount } = useNotifications();

  const name = profile.name ?? "";
  const rawAvatar = profile.avatar ?? profile.profile_image ?? null;
  const avatarUrl = rawAvatar?.startsWith("http") ? `${rawAvatar}${rawAvatar.includes('?') ? '&' : '?'}t=${photoTimestamp}` : rawAvatar;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <View className="flex-row items-center justify-between px-5 pt-2">
      <View className="flex-row items-center gap-4">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-[52px] h-[52px] rounded-full"
          />
        ) : initials ? (
          <LinearGradient
            colors={["#A855F7", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-[52px] h-[52px] rounded-full items-center justify-center"
          >
            <Text className="text-[22px] font-bold text-white">{initials}</Text>
          </LinearGradient>
        ) : (
          <View
            className="w-[52px] h-[52px] rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-[22px] font-bold" style={{ color: colors.text }}>A</Text>
          </View>
        )}
        <View className="gap-0.5">
          <Text className="text-[11px] font-semibold tracking-[1.5px]" style={{ color: colors.primary }}>
            ADMIN
          </Text>
          <Text className="text-[26px] font-bold" style={{ color: colors.text }}>
            {name || "Console"}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          className="w-[36px] h-[36px] rounded-full items-center justify-center border"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun size={18} color={colors.secondaryText} />
          ) : (
            <Moon size={18} color={colors.secondaryText} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[36px] h-[36px] rounded-full items-center justify-center border"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Bell size={18} color={colors.secondaryText} />
          {unreadCount > 0 && (
            <View
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full items-center justify-center px-1"
              style={{ backgroundColor: "#EF4444" }}
            >
              <Text className="text-[10px] font-bold text-white">{badgeText}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[36px] h-[36px] rounded-full items-center justify-center border"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          onPress={onSignOut}
          activeOpacity={0.7}
        >
          <LogOut size={18} color={colors.secondaryText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(AdminOverviewHeader);
