import { View, Text } from "react-native";
import SectionHeading from "./Heading";
import { useTheme } from "../../context/useTheme";
import { useSkills } from "../../context/SkillsContext";

export default function SkillsSection() {
  const { colors } = useTheme();
  const { getSkillsByCategory } = useSkills();
  const categories = getSkillsByCategory();

  return (
    <View>
      <SectionHeading eyebrow="TOOLKIT" title="Skills & Craft" />

      <View className="px-5 pt-5 gap-4">
        {categories.map(({ category, skills }) => (
          <View
            key={category}
            className="rounded-2xl border p-5 gap-4"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
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
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.border }}
                  >
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${skill.percentage}%`,
                        backgroundColor: colors.primary,
                      }}
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
