import { memo, useCallback } from "react";
import { View, Text } from "react-native";
import SkillCard from "./SkillCard";
import { useTheme } from "../../context/useTheme";
import type { Skill, SkillCategory } from "../../types/skill";

interface SkillSectionProps {
  category: SkillCategory;
  skills: Skill[];
  onDelete: (id: string) => void;
  onEdit: (skill: Skill) => void;
}

function SkillSection({ category, skills, onDelete, onEdit }: SkillSectionProps) {
  const { colors } = useTheme();

  return (
    <View
      className="rounded-3xl border p-5 gap-4"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <Text
        className="text-[12px] font-bold tracking-[1.5px]"
        style={{ color: colors.secondaryText }}
      >
        {category.toUpperCase()}
      </Text>

      <View className="gap-4">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </View>
    </View>
  );
}

export default memo(SkillSection);
