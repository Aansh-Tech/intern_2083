import { memo, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { useTheme } from "../../context/useTheme";
import type { Skill } from "../../types/skill";

interface SkillCardProps {
  skill: Skill;
  onDelete: (id: string) => void;
  onEdit: (skill: Skill) => void;
}

function SkillCard({ skill, onDelete, onEdit }: SkillCardProps) {
  const { colors } = useTheme();

  const handleDelete = useCallback(() => onDelete(skill.id), [onDelete, skill.id]);
  const handleEdit = useCallback(() => onEdit(skill), [onEdit, skill]);

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3"
      onPress={handleEdit}
      activeOpacity={0.7}
    >
      <View className="flex-1 gap-2">
        <View className="flex-row justify-between items-center">
          <Text
            className="text-[15px] font-semibold"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {skill.name}
          </Text>
          <Text className="text-[13px] font-bold" style={{ color: colors.primary }}>
            {skill.percentage}%
          </Text>
        </View>
        <View
          className="h-[6px] rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <View
            className="h-full rounded-full"
            style={{ width: `${skill.percentage}%`, backgroundColor: colors.primary }}
          />
        </View>
      </View>

      <TouchableOpacity
        className="w-[36px] h-[36px] rounded-full items-center justify-center"
        style={{ backgroundColor: "#EF444420" }}
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <Trash2 size={16} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default memo(SkillCard);
