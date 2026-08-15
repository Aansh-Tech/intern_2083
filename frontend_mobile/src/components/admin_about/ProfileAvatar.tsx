import { useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { User, Camera, Plus, Image as ImageIcon, Trash2 } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import AppSheet from "../shared_components/AppSheet";

interface ProfileAvatarProps {
  avatarUri: string | null;
  hasProfilePicture: boolean;
  name: string;
  role: string;
  uploading: boolean;
  onChooseGallery: () => void;
  onRemove: () => void;
}

export default function ProfileAvatar({
  avatarUri,
  hasProfilePicture,
  name,
  role,
  uploading,
  onChooseGallery,
  onRemove,
}: ProfileAvatarProps) {
  const { colors } = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);

  const hasAvatar = hasProfilePicture;

  const openSheet = () => {
    if (uploading) return;
    setSheetVisible(true);
  };

  const closeSheet = () => setSheetVisible(false);

  const handleGallery = () => {
    closeSheet();
    onChooseGallery();
  };

  const handleRemove = () => {
    closeSheet();
    onRemove();
  };

  return (
    <View className="flex-row items-center gap-4 py-4">
      <TouchableOpacity
        onPress={openSheet}
        activeOpacity={0.85}
        disabled={uploading}
        accessibilityRole="button"
        accessibilityLabel={hasAvatar ? "Change profile picture" : "Add profile picture"}
      >
        <View style={{ width: 96, height: 96 }}>
          {hasAvatar ? (
            <Image
              source={{ uri: avatarUri! }}
              style={{ width: 96, height: 96, borderRadius: 48 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={40} color={colors.secondaryText} strokeWidth={1.6} />
            </View>
          )}

          <View
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.primary,
              borderWidth: 3,
              borderColor: colors.background,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : hasAvatar ? (
              <Camera size={15} color={colors.text} />
            ) : (
              <Plus size={17} color={colors.text} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View className="flex-1 gap-1">
        <Text className="text-[20px] font-bold" style={{ color: colors.text }} numberOfLines={1}>
          {name}
        </Text>
        {role ? (
          <Text className="text-[14px]" style={{ color: colors.secondaryText }} numberOfLines={1}>
            {role}
          </Text>
        ) : null}
      </View>

      <AppSheet
        visible={sheetVisible}
        onClose={closeSheet}
        title="Profile picture"
        footer={
          <TouchableOpacity
            className="h-12 items-center justify-center rounded-full border"
            style={{ borderColor: colors.border }}
            onPress={closeSheet}
            activeOpacity={0.8}
          >
            <Text className="text-[15px] font-semibold" style={{ color: colors.secondaryText }}>
              Cancel
            </Text>
          </TouchableOpacity>
        }
      >
        <View className="gap-4">
          <View className="gap-1">
            <Text className="text-[17px] font-bold" style={{ color: colors.text }}>
              {hasAvatar ? "Change profile picture" : "Add profile picture"}
            </Text>
            <Text className="text-[13px]" style={{ color: colors.secondaryText }}>
              {hasAvatar ? "Choose a new photo" : "Choose a photo from your device"}
            </Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 h-12 rounded-2xl border"
            style={{ borderColor: colors.border }}
            activeOpacity={0.7}
            onPress={handleGallery}
          >
            <ImageIcon size={18} color={colors.primary} />
            <Text className="text-[15px] font-semibold" style={{ color: colors.primary }}>
              Choose photo
            </Text>
          </TouchableOpacity>

          {hasAvatar ? (
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 h-12 rounded-2xl border"
              style={{ borderColor: "#EF4444" }}
              activeOpacity={0.7}
              onPress={handleRemove}
            >
              <Trash2 size={18} color="#EF4444" />
              <Text className="text-[15px] font-semibold" style={{ color: "#EF4444" }}>
                Remove profile picture
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </AppSheet>
    </View>
  );
}