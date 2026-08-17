import { memo } from "react";
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LogOut, Sun, Moon, Bell } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useProfile } from "../../context/ProfileContext";
import { useNotifications } from "../../context/NotificationContext";
import { useResponsiveFontSize } from "../../utils/responsive";

interface AdminOverviewHeaderProps {
  onSignOut: () => void;
  onNotificationPress: () => void;
}

function AdminOverviewHeader({ onSignOut, onNotificationPress }: AdminOverviewHeaderProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { profile, photoTimestamp } = useProfile();
  const { unreadCount } = useNotifications();
  const { width } = useWindowDimensions();
  const nameSize = useResponsiveFontSize(26);
  const compact = width < 360;

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
  const avatarSize = compact ? 44 : 52;
  const avatarTextSize = compact ? 18 : 22;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: compact ? 10 : 16, flex: 1 }}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
          />
        ) : initials ? (
          <LinearGradient
            colors={["#A855F7", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: avatarTextSize, fontWeight: "bold", color: "#FFFFFF" }}>{initials}</Text>
          </LinearGradient>
        ) : (
          <View
            style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary }}
          >
            <Text style={{ fontSize: avatarTextSize, fontWeight: "bold", color: colors.text }}>A</Text>
          </View>
        )}
        <View style={{ gap: 2, flexShrink: 1, flex: 1 }}>
          <Text className="text-[11px] font-semibold tracking-[1.5px]" style={{ color: colors.primary }}>
            ADMIN
          </Text>
          <Text style={{ fontSize: nameSize, fontWeight: "bold", color: colors.text }} numberOfLines={1}>
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
