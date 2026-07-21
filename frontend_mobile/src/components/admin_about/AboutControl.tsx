import { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Save, FileText, Upload, Plus, Pencil, Trash2, X } from "lucide-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useTheme } from "../../context/useTheme";
import { useProfile } from "../../context/ProfileContext";
import { saveAbout } from "../../services/aboutService";
import type { SocialLinkInput } from "../../services/aboutService";
import { uploadImage } from "../../services/image";
import AvatarUploader from "./PhotoUpload";
import IdentityForm from "./IdForm";

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
  const { profile, refreshProfile } = useProfile();
  const mountedRef = useRef(true);
  const previousSocialLinksRef = useRef<SocialLinkInput[]>([]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

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
  }, [profile]);

  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (!result.canceled && result.assets?.[0]) {
      setResumeUri(result.assets[0].uri);
      setResumeName(result.assets[0].name);
    }
  };

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
    } else {
      setSocialLinks((prev) => [...prev, { platform: displayPlatform, url: formUrl }]);
    }
    setShowForm(false);
  }, [formUrl, editIndex]);

  const handleDelete = useCallback((index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = async () => {
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

      Alert.alert("Saved", "Your About page has been updated.");
    } catch {
      if (!mountedRef.current) return;
      Alert.alert("Error", "Failed to save. Please try again.");
    } finally {
      if (mountedRef.current) setSaving(false);
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

        {!showForm ? (
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 h-12 rounded-2xl border border-dashed"
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
      </View>
    </View>
  );
}
