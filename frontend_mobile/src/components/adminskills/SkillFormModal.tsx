import { memo } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import CategorySelector from "./CategorySelector";
import PercentageSlider from "./PercentageSlider";
import AppSheet from "../shared_components/AppSheet";
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
    <AppSheet
      visible={visible}
      onClose={onClose}
      title="Edit Skill"
      footer={
        <View className="flex-row gap-3">
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
      }
    >
      <View className="gap-4">
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
              cursorColor={colors.primary}
              selectionColor={colors.primary}
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
    </AppSheet>
  );
}

export default memo(SkillFormModal);