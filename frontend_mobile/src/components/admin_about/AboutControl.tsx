import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Save } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import { useProfile } from "../../context/ProfileContext";
import AvatarUploader from "./PhotoUpload";
import IdentityForm from "./IdForm";

export default function AboutControl() {
  const { colors } = useTheme();
  const { profile, updateProfile } = useProfile();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile.name) setName(profile.name);
    if (profile.title || profile.subtitle || profile.headline) {
      setRole(profile.title ?? profile.subtitle ?? profile.headline ?? "");
    }
    if (profile.bio || profile.description) {
      setBio(profile.bio ?? profile.description ?? "");
    }
    if (profile.avatar || profile.profile_image) {
      setAvatarUri(profile.avatar ?? profile.profile_image ?? null);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name,
        title: role,
        bio,
        avatar: avatarUri ?? undefined,
      });
      Alert.alert("Saved", "Your About page has been updated.");
    } catch {
      Alert.alert("Error", "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="gap-5 px-5 pb-10">
      <View className="flex-row items-start justify-between pt-2">
        <View className="gap-1">
          <Text className="text-[26px] font-bold" style={{ color: colors.text }}>
            About page
          </Text>
          <Text className="text-[14px]" style={{ color: colors.secondaryText }}>
            Update your public profile.
          </Text>
        </View>

        <TouchableOpacity
          className="h-11 flex-row items-center gap-2 rounded-full px-4"
          style={{ backgroundColor: colors.primary, opacity: saving ? 0.6 : 1 }}
          activeOpacity={0.85}
          onPress={handleSave}
          disabled={saving}
        >
          <Save size={16} color={colors.text} />
          <Text className="text-[14px] font-semibold" style={{ color: colors.text }}>
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <AvatarUploader
        avatarUri={avatarUri}
        initial={name?.charAt(0) || "A"}
        onAvatarChange={setAvatarUri}
      />

      <IdentityForm
        name={name}
        role={role}
        bio={bio}
        onChangeName={setName}
        onChangeRole={setRole}
        onChangeBio={setBio}
      />
    </View>
  );
}