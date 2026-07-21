import { useState, useCallback, memo } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import CategorySelector from "./CategorySelector";
import PercentageSlider from "./PercentageSlider";
import { useTheme } from "../../context/useTheme";
import type { SkillCategory } from "../../types/skill";

interface SkillFormProps {
  onAdd: (data: { category: SkillCategory; name: string; percentage: number }) => Promise<string | null>;
  onSuccess?: () => void;
}

function SkillForm({ onAdd, onSuccess }: SkillFormProps) {
  const { colors } = useTheme();
  const [category, setCategory] = useState<SkillCategory>("Frontend");
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState(50);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = useCallback(async () => {
    setError(null);
    const err = await onAdd({ category, name, percentage });
    if (err) {
      setError(err);
    } else {
      setName("");
      setPercentage(50);
      onSuccess?.();
    }
  }, [onAdd, category, name, percentage, onSuccess]);

  return (
    <View
      className="mx-5 rounded-3xl border p-5 gap-4"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <Text className="text-[13px] font-bold uppercase tracking-[0.8px]" style={{ color: colors.primary }}>
        Add Skill
      </Text>

      <View className="gap-1.5">
        <Text className="text-[13px] font-semibold uppercase tracking-[0.8px]" style={{ color: colors.secondaryText }}>
          Category
        </Text>
        <CategorySelector value={category} onChange={setCategory} />
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
            onChangeText={(t) => { setName(t); setError(null); }}
            placeholder="e.g. React Native"
            placeholderTextColor={colors.secondaryText}
            autoCapitalize="words"
            cursorColor={colors.primary}
            selectionColor={colors.primary}
          />
        </View>
      </View>

      <PercentageSlider value={percentage} onChange={setPercentage} />

      {error && (
        <Text className="text-[13px] font-medium" style={{ color: "#EF4444" }}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        className="flex-row items-center justify-center h-[56px] rounded-full gap-2"
        style={{ backgroundColor: colors.primary }}
        onPress={handleAdd}
        activeOpacity={0.8}
      >
        <Plus size={20} color={colors.text} />
        <Text className="text-[15px] font-bold" style={{ color: colors.text }}>
          Add Skill
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(SkillForm);
