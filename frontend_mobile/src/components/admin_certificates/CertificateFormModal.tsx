import { useState, useCallback, useEffect, useRef, memo } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Plus, X } from "lucide-react-native";
import AppSheet from "../shared_components/AppSheet";
import { useTheme } from "../../context/useTheme";
import type { Certificate } from "../../types/certificate";

interface CertificateFormModalProps {
  visible: boolean;
  editTarget: Certificate | null;
  onSave: (data: {
    title: string;
    issuer: string;
    category: string;
    description: string;
    issueDate: string;
    image?: string;
  }) => Promise<void>;
  onClose: () => void;
}

function CertificateFormModal({ visible, editTarget, onSave, onClose }: CertificateFormModalProps) {
  const { colors } = useTheme();
  const isEditing = !!editTarget;

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const savingRef = useRef(false);

  const resetForm = useCallback(() => {
    if (editTarget) {
      setTitle(editTarget.title ?? "");
      setIssuer(editTarget.issuer ?? "");
      setCategory(editTarget.category ?? "");
      setDescription(editTarget.description ?? "");
      setIssueDate(editTarget.issueDate ?? "");
      setImageUri(editTarget.image ?? null);
    } else {
      setTitle("");
      setIssuer("");
      setCategory("");
      setDescription("");
      setIssueDate("");
      setImageUri(null);
    }
  }, [editTarget]);

  useEffect(() => {
    if (visible) resetForm();
  }, [visible, resetForm]);

  const handlePickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const localUri = result.assets[0].uri;
      setImageUri(localUri);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!title.trim() || !issuer.trim()) return;
    if (savingRef.current) return;
    savingRef.current = true;
    try {
      await onSave({
        title: title.trim(),
        issuer: issuer.trim(),
        category: category.trim(),
        description: description.trim(),
        issueDate: issueDate.trim(),
        image: imageUri ?? undefined,
      });
    } finally {
      savingRef.current = false;
    }
  }, [title, issuer, category, description, issueDate, imageUri, onSave]);

  const inputStyle = {
    backgroundColor: colors.background,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <AppSheet
      visible={visible}
      onClose={onClose}
      title={isEditing ? "Edit Certificate" : "Add Certificate"}
      footer={
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 h-[50px] rounded-full border items-center justify-center"
            style={{ borderColor: colors.border }}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text className="text-[15px] font-semibold" style={{ color: colors.secondaryText }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 h-[50px] rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text className="text-[15px] font-bold" style={{ color: colors.text }}>
              {isEditing ? "Save" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View className="gap-4">
        <View className="gap-2">
          <Text className="text-[14px]" style={{ color: colors.secondaryText }}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Certificate title"
            placeholderTextColor={colors.secondaryText}
            className="h-12 rounded-2xl border px-4 text-[15px]"
            style={inputStyle}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
          />
        </View>

        <View className="gap-2">
          <Text className="text-[14px]" style={{ color: colors.secondaryText }}>Issuer</Text>
          <TextInput
            value={issuer}
            onChangeText={setIssuer}
            placeholder="Issuing organization"
            placeholderTextColor={colors.secondaryText}
            className="h-12 rounded-2xl border px-4 text-[15px]"
            style={inputStyle}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
          />
        </View>

        <View className="gap-2">
          <Text className="text-[14px]" style={{ color: colors.secondaryText }}>Category</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. FRONTEND, BACKEND, DESIGN"
            placeholderTextColor={colors.secondaryText}
            className="h-12 rounded-2xl border px-4 text-[15px]"
            style={inputStyle}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
            autoCapitalize="characters"
          />
        </View>

        <View className="gap-2">
          <Text className="text-[14px]" style={{ color: colors.secondaryText }}>Issue Date</Text>
          <TextInput
            value={issueDate}
            onChangeText={setIssueDate}
            placeholder="e.g. 2024-01-15"
            placeholderTextColor={colors.secondaryText}
            className="h-12 rounded-2xl border px-4 text-[15px]"
            style={inputStyle}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
          />
        </View>

        <View className="gap-2">
          <Text className="text-[14px]" style={{ color: colors.secondaryText }}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Short description"
            placeholderTextColor={colors.secondaryText}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="min-h-[80px] rounded-2xl border px-4 py-3 text-[15px]"
            style={inputStyle}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
          />
        </View>

        <View className="gap-2">
          <Text className="text-[14px]" style={{ color: colors.secondaryText }}>Image</Text>
          {imageUri ? (
            <View className="relative">
              <Image source={{ uri: imageUri }} className="w-full h-[140px] rounded-2xl" resizeMode="cover" />
              <TouchableOpacity
                className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                onPress={() => setImageUri(null)}
              >
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="h-[56px] flex-row items-center justify-center gap-2 rounded-2xl border"
              style={{ backgroundColor: colors.background, borderColor: colors.border }}
              onPress={handlePickImage}
              activeOpacity={0.7}
            >
              <Plus size={18} color={colors.primary} />
              <Text className="text-[14px] font-semibold" style={{ color: colors.primary }}>
                Select Image
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </AppSheet>
  );
}

export default memo(CertificateFormModal);