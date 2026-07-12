import { memo } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from "react-native";
import CategorySelector from "./CategorySelector";
import PercentageSlider from "./PercentageSlider";
import { useTheme } from "../../context/useTheme";
import type { SkillCategory } from "../../types/skill";

interface SkillFormModalProps {
  visible: boolean;
  category: SkillCategory;
  name: string;
  percentage: number;
  error: string | null;
  onCategoryChange: (c: SkillCategory) => void;
  onNameChange: (t: string) => void;
  onPercentageChange: (v: number) => void;
  onSave: () => void;
  onClose: () => void;
}

function SkillFormModal({
  visible,
  category,
  name,
  percentage,
  error,
  onCategoryChange,
  onNameChange,
  onPercentageChange,
  onSave,
  onClose,
}: SkillFormModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />
        <View
          className="rounded-t-[28px] border-t px-5 pt-6 pb-8"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-[18px] font-bold text-center" style={{ color: colors.text }}>
              Edit Skill
            </Text>

            <View className="mt-5 gap-4">
              <View className="gap-1.5">
                <Text className="text-[13px] font-semibold uppercase tracking-[0.8px]" style={{ color: colors.secondaryText }}>
                  Category
                </Text>
                <CategorySelector value={category} onChange={onCategoryChange} />
              </View>

              <View className="gap-1.5">
                <Text className="text-[13px] font-semibold uppercase tracking-[0.8px]" style={{ color: colors.secondaryText }}>
                  Skill Name
                </Text>
                <View
                  className="rounded-[18px] border px-4"
                  style={{ backgroundColor: colors.background, borderColor: error ? "#EF4444" : colors.border }}
                >
                  <TextInput
                    className="text-base"
                    style={{ color: colors.text, height: 56 }}
                    value={name}
                    onChangeText={onNameChange}
                    placeholder="e.g. React Native"
                    placeholderTextColor={colors.secondaryText}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <PercentageSlider value={percentage} onChange={onPercentageChange} />

              {error && (
                <Text className="text-[13px] font-medium" style={{ color: "#EF4444" }}>
                  {error}
                </Text>
              )}
            </View>

            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                className="flex-1 h-[50px] rounded-full border items-center justify-center"
                style={{ borderColor: colors.border }}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text className="text-[15px] font-semibold" style={{ color: colors.secondaryText }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 h-[50px] rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
                onPress={onSave}
                activeOpacity={0.8}
              >
                <Text className="text-[15px] font-bold" style={{ color: colors.text }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default memo(SkillFormModal);
