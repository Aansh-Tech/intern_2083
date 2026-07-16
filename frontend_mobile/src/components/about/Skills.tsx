import { View, Text } from "react-native";
import SectionHeading from "./Heading";
import { useTheme } from "../../context/useTheme";
import { useSkills } from "../../context/SkillsContext";

export default function SkillsSection() {
  const { colors } = useTheme();
  const { skills, loading, getSkillsByCategory } = useSkills();
  const skillCategories = getSkillsByCategory();
  //console.log("[SkillsSection] skills count:", skills.length);
  //console.log("[SkillsSection] skillCategories count:", skillCategories.length);
  //console.log("[SkillsSection] loading:", loading);
  if (skillCategories.length > 0) {
    skillCategories.forEach((c) => console.log("[SkillsSection] category:", c.category, "skills:", c.skills.length));
  }

  return (
    <View>
      <SectionHeading eyebrow="TOOLKIT" title="Skills & Craft" />

      <View className="px-5 pt-5 gap-4">
        {skillCategories.map(({ category, skills }) => (
          <View
            key={category}
            style={[
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            className="rounded-2xl border p-5 gap-4"
          >
            <Text
              className="text-xs font-bold tracking-[1.5px]"
              style={{ color: colors.secondaryText }}
            >
              {category.toUpperCase()}
            </Text>

            <View className="gap-3.5">
              {skills.map((skill) => (
                <View key={skill.id} className="gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-[15px] font-semibold"
                      style={{ color: colors.text }}
                    >
                      {skill.name}
                    </Text>
                    <Text
                      className="text-[13px] font-semibold"
                      style={{ color: colors.secondaryText }}
                    >
                      {skill.percentage}%
                    </Text>
                  </View>
                  <View
                    style={{ backgroundColor: colors.border }}
                    className="h-1.5 rounded-full overflow-hidden"
                  >
                    <View
                      style={{
                        width: `${skill.percentage}%`,
                        backgroundColor: colors.primary,
                      }}
                      className="h-full rounded-full"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}