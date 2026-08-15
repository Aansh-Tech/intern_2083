import { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Save, FileText, Upload, Plus, Pencil, Trash2, X } from "lucide-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../context/useTheme";
import { usePopup } from "../Popup";
import { useProfile } from "../../context/ProfileContext";
import { saveAbout } from "../../services/aboutService";
import type { SocialLinkInput } from "../../services/aboutService";
import { uploadImage, uploadProjectImage, deleteImage, resolveImageUrl } from "../../services/image";
import ProfileAvatar from "./ProfileAvatar";
import IdentityForm from "./IdForm";
import { useResponsiveContainer } from "../../utils/responsive";

function detectPlatform(url: string): string {
  const lower = url.toLowerCase().trim();
  if (lower.startsWith("mailto:") || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) return "email";
  if (lower.includes("github.com")) return "github";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("facebook.com") || lower.includes("fb.com")) return "facebook";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "twitter";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  return "website";
}

const PLATFORM_ICONS: Record<string, string> = {
  github: "logo-github",
  linkedin: "logo-linkedin",
  facebook: "logo-facebook",
  instagram: "logo-instagram",
  email: "mail-outline",
  website: "globe-outline",
  twitter: "logo-twitter",
  youtube: "logo-youtube",
};

export default function AboutControl() {
  const { colors } = useTheme();
  const { showModal, showConfirm, showToast } = usePopup();
  const { profile, refreshProfile, applyAvatar, loading } = useProfile();
  const mountedRef = useRef(true);
  const previousSocialLinksRef = useRef<SocialLinkInput[]>([]);
  const container = useResponsiveContainer();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarAttachmentId, setAvatarAttachmentId] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [resumeUri, setResumeUri] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);

  const [socialLinks, setSocialLinks] = useState<SocialLinkInput[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formUrl, setFormUrl] = useState("");

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: colors.border,
    color: colors.text,
  };

  useEffect(() => {
    if (hydrated || loading) return;
    if (profile.title || profile.subtitle || profile.headline) {
      setRole(profile.title ?? profile.subtitle ?? profile.headline ?? "");
    }
    if (profile.bio || profile.description) {
      setBio(profile.bio ?? profile.description ?? "");
    }

    if (profile.resume_url) {
      setResumeName(profile.resume_url.split("/").pop() ?? null);
    }

    if (profile.socialLinks) {
      const loaded = profile.socialLinks.map((link) => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
      }));
      setSocialLinks(loaded);
      previousSocialLinksRef.current = loaded;
    }
    setHydrated(true);
  }, [profile, hydrated, loading]);

  useEffect(() => {
    const fromProfile = profile.avatar ?? profile.profile_image ?? null;
    if (typeof fromProfile === "string" && fromProfile.trim()) {
      setAvatarUri(fromProfile);
    }
  }, [profile.avatar, profile.profile_image]);

  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (!result.canceled && result.assets?.[0]) {
      setResumeUri(result.assets[0].uri);
      setResumeName(result.assets[0].name);
    }
  };

  const pickAndUploadAvatar = useCallback(async () => {
    if (uploadingAvatar || !profile.id) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    setUploadingAvatar(true);
    try {
      const uploaded = await uploadProjectImage(
        result.assets[0].uri,
        "profile",
        profile.id,
        { type: "avatar", isPrimary: true }
      );
      setAvatarUri(uploaded.url);
      setAvatarAttachmentId(uploaded.id || null);
      applyAvatar(uploaded.url);
      if (!mountedRef.current) return;
      showToast({ type: "success", message: "Profile picture updated" });
    } catch {
      if (!mountedRef.current) return;
      showToast({ type: "error", message: "Could not update profile picture" });
    } finally {
      if (mountedRef.current) setUploadingAvatar(false);
    }
  }, [uploadingAvatar, profile.id, applyAvatar, showToast]);

  const removeAvatar = useCallback(async () => {
    try {
      const imagesArr = Array.isArray(profile.images) ? profile.images : [];
      const currentUrl = avatarUri;
      const avatarAttachments = (imagesArr as any[]).filter(
        (img: any) =>
          img?.type === "avatar" ||
          (img?.image?.url && resolveImageUrl(img.image.url) === currentUrl)
      );
      const targetIds = new Set<string>();
      avatarAttachments.forEach((img: any) => {
        if (img?.id) targetIds.add(String(img.id));
      });
      if (avatarAttachmentId) targetIds.add(avatarAttachmentId);

      await Promise.all([...targetIds].map((id) => deleteImage(id)));

      setAvatarUri(null);
      setAvatarAttachmentId(null);
      applyAvatar(null);
      if (!mountedRef.current) return;
      showToast({ type: "success", message: "Profile picture removed" });
    } catch {
      if (!mountedRef.current) return;
      showToast({ type: "error", message: "Could not remove profile picture" });
    }
  }, [avatarUri, avatarAttachmentId, profile.images, applyAvatar, showToast]);

  const confirmRemoveAvatar = useCallback(() => {
    showConfirm({
      title: "Remove profile picture?",
      message: "Are you sure you want to remove your profile picture?",
      confirmText: "Remove",
      cancelText: "Cancel",
      destructive: true,
      onConfirm: removeAvatar,
    });
  }, [showConfirm, removeAvatar]);

  const openAddForm = useCallback(() => {
    setEditIndex(null);
    setFormUrl("");
    setShowForm(true);
  }, []);

  const openEditForm = useCallback((index: number) => {
    setEditIndex(index);
    setFormUrl(socialLinks[index].url);
    setShowForm(true);
  }, [socialLinks]);

  const handleFormSave = useCallback(() => {
    const detectedPlatform = detectPlatform(formUrl);
    const displayPlatform = detectedPlatform.charAt(0).toUpperCase() + detectedPlatform.slice(1);
    if (editIndex !== null) {
      setSocialLinks((prev) => {
        const next = [...prev];
        next[editIndex] = { id: next[editIndex].id, platform: displayPlatform, url: formUrl };
        return next;
      });
      showToast({ type: "success", message: "Social link updated" });
    } else {
      setSocialLinks((prev) => [...prev, { platform: displayPlatform, url: formUrl }]);
      showToast({ type: "success", message: "Social link added" });
    }
    setShowForm(false);
  }, [formUrl, editIndex, showToast]);

  const handleDelete = useCallback((index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
    showToast({ type: "success", message: "Social link removed" });
  }, [showToast]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      let resolvedPhoto = avatarUri;

      if (avatarUri && !avatarUri.startsWith("http") && profile.id) {
        resolvedPhoto = await uploadImage(avatarUri, "profile", profile.id, { type: "avatar", isPrimary: true });
      }

      await saveAbout({
        title: role,
        bio,
        profile_photo: resolvedPhoto ?? undefined,
        resumeUri: resumeUri,
        socialLinks: socialLinks,
        previousSocialLinks: previousSocialLinksRef.current,
      });
      if (!mountedRef.current) return;

      await refreshProfile();
      if (!mountedRef.current) return;

      showModal({
        type: "success",
        title: "Saved successfully",
        message: "Your About page has been updated.",
        primaryText: "OK",
      });
    } catch {
      if (!mountedRef.current) return;
      showModal({
        type: "error",
        title: "Something went wrong",
        message: "Failed to save. Please try again.",
        primaryText: "Try Again",
        secondaryText: "Cancel",
        onPrimary: () => handleSave(),
      });
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  };

  return (
    <View style={[container, { gap: 20, paddingHorizontal: 20, paddingBottom: 40 }]}>
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

      <ProfileAvatar
        avatarUri={avatarUri}
        hasProfilePicture={
          typeof avatarUri === "string" && avatarUri.trim().length > 0
        }
        name={profile.name ?? "Anish Shrestha"}
        role={profile.title ?? profile.subtitle ?? profile.headline ?? ""}
        uploading={uploadingAvatar}
        onChooseGallery={pickAndUploadAvatar}
        onRemove={confirmRemoveAvatar}
      />

      <IdentityForm
        role={role}
        bio={bio}
        onChangeRole={setRole}
        onChangeBio={setBio}
      />

      <View
        className="gap-4 rounded-[20px] border p-5"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <Text
          className="text-[12px] font-bold tracking-[1.5px]"
          style={{ color: colors.primary }}
        >
          RESUME
        </Text>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="h-11 flex-row items-center gap-2 rounded-full border px-4"
            style={{ backgroundColor: colors.background, borderColor: colors.border }}
            activeOpacity={0.7}
            onPress={pickResume}
          >
            <Upload size={16} color={colors.text} />
            <Text className="text-[14px] font-semibold" style={{ color: colors.text }}>
              Upload Resume
            </Text>
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center gap-2">
            <FileText size={16} color={colors.secondaryText} />
            <Text
              className="text-[14px] flex-shrink"
              style={{ color: colors.secondaryText }}
              numberOfLines={1}
            >
              {resumeName || "No resume uploaded"}
            </Text>
          </View>
        </View>
      </View>

      <View
        className="gap-4 rounded-[20px] border p-5"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <Text
          className="text-[12px] font-bold tracking-[1.5px]"
          style={{ color: colors.primary }}
        >
          SOCIAL LINKS
        </Text>

        {!showForm ? (
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 h-12 rounded-2xl border border-dashed px-4"
            style={{ borderColor: colors.border }}
            activeOpacity={0.7}
            onPress={openAddForm}
          >
            <Plus size={18} color={colors.primary} />
            <Text className="text-[14px] font-semibold" style={{ color: colors.primary }}>
              Add Social Link
            </Text>
          </TouchableOpacity>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              <View
                className="gap-4 rounded-2xl border p-4"
                style={{ backgroundColor: colors.background, borderColor: colors.border }}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-[14px] font-bold" style={{ color: colors.text }}>
                    {editIndex !== null ? "Edit Social Link" : "Add Social Link"}
                  </Text>
                  <TouchableOpacity onPress={() => setShowForm(false)} activeOpacity={0.7}>
                    <X size={18} color={colors.secondaryText} />
                  </TouchableOpacity>
                </View>

                <View className="gap-1.5">
                  <Text className="text-[12px] font-semibold" style={{ color: colors.secondaryText }}>
                    URL
                  </Text>
                  <TextInput
                    value={formUrl}
                    onChangeText={setFormUrl}
                    placeholder="https://github.com/username"
                    placeholderTextColor={colors.secondaryText}
                    className="h-12 rounded-2xl border px-4 text-[14px]"
                    style={inputStyle}
                    cursorColor={colors.primary}
                    selectionColor={colors.primary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                  />
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 h-11 rounded-full border items-center justify-center"
                    style={{ borderColor: colors.border }}
                    onPress={() => setShowForm(false)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-[13px] font-semibold" style={{ color: colors.secondaryText }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 h-11 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                    onPress={handleFormSave}
                    activeOpacity={0.8}
                  >
                    <Text className="text-[13px] font-bold" style={{ color: colors.text }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}

        {socialLinks.map((link, index) => (
          <View
            key={link.id != null ? `saved-${link.id}` : `new-${index}`}
            className="flex-row items-center gap-3 rounded-2xl border px-4 py-3"
            style={{ backgroundColor: colors.background, borderColor: colors.border }}
          >
            <Ionicons
              name={(PLATFORM_ICONS[link.platform.toLowerCase()] || "link-outline") as any}
              size={20}
              color={colors.text}
            />
            <View className="flex-1 gap-0.5">
              <Text className="text-[13px] font-semibold" style={{ color: colors.text }}>
                {link.platform}
              </Text>
              <Text
                className="text-[12px]"
                style={{ color: colors.secondaryText }}
                numberOfLines={1}
              >
                {typeof link.url === "string" ? link.url : String(link.url ?? "")}
              </Text>
            </View>
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.card }}
              onPress={() => openEditForm(index)}
              activeOpacity={0.7}
            >
              <Pencil size={14} color={colors.secondaryText} />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.card }}
              onPress={() => handleDelete(index)}
              activeOpacity={0.7}
            >
              <Trash2 size={14} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
