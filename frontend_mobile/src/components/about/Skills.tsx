import { View, Text } from "react-native";
import SectionHeading from "./Heading";
import { useTheme } from "../../context/useTheme";
import { useSkills } from "../../context/SkillsContext";
import type { SkillCategory } from "../../types/skill";

const CATEGORY_ORDER: SkillCategory[] = ["Frontend", "Backend", "Design", "Other"];

function groupByCategory(skills: { id: string; category: SkillCategory; name: string; percentage: number }[]): { category: SkillCategory; skills: typeof skills }[] {
  const map = new Map<SkillCategory, typeof skills>();
  for (const s of skills) {
    const arr = map.get(s.category);
    if (arr) {
      arr.push(s);
    } else {
      map.set(s.category, [s]);
    }
  }
  return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({ category: c, skills: map.get(c)! }));
}

export default function SkillsSection() {
  const { colors } = useTheme();
  const { skills, loading } = useSkills();
  const skillCategories = groupByCategory(skills);

  return (
    <View>
      <SectionHeading eyebrow="TOOLKIT" title="Skills & Craft" />

      {skillCategories.length > 0 ? (
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
      ) : (
        <View className="px-5 pt-5">
          <Text className="text-sm" style={{ color: colors.secondaryText }}>
            {loading ? "Loading skills..." : "No skills to display yet."}
          </Text>
        </View>
      )}
    </View>
  );
}
