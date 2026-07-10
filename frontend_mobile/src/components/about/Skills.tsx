import { View, Text } from "react-native";
import SectionHeading from "./Heading";
import { useTheme } from "../../context/useTheme";

const skillCategories = [
  {
    title: "FRONTEND",
    skills: [
      { name: "React & Next.js", value: 96 },
      { name: "TypeScript", value: 92 },
      { name: "Tailwind CSS", value: 96 },
    ],
  },
  {
    title: "BACKEND",
    skills: [
      { name: "Node.js", value: 76 },
      { name: "PostgreSQL", value: 78 },
      { name: "Laravel", value: 86 },
    ],
  },
  {
    title: "DESIGN",
    skills: [
      { name: "Figma", value: 94 },
      { name: "Motion Design", value: 82 },
      { name: "Design Systems", value: 90 },
    ],
  },
];

export default function SkillsSection() {
  const { colors } = useTheme();

  return (
    <View>
      <SectionHeading eyebrow="TOOLKIT" title="Skills & Craft" />

      <View className="px-5 pt-5 gap-4">
        {skillCategories.map((category) => (
          <View
            key={category.title}
            style={[
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            className="rounded-2xl border p-5 gap-4"
          >
            <Text
              className="text-xs font-bold tracking-[1.5px]"
              style={{ color: colors.secondaryText }}
            >
              {category.title}
            </Text>

            <View className="gap-3.5">
              {category.skills.map((skill) => (
                <View key={skill.name} className="gap-2">
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
                      {skill.value}%
                    </Text>
                  </View>
                  <View
                    style={{ backgroundColor: colors.border }}
                    className="h-1.5 rounded-full overflow-hidden"
                  >
                    <View
                      style={{
                        width: `${skill.value}%`,
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