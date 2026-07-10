import { View, Text, StyleSheet } from "react-native";
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
      { name: "Node.js", value: 85 },
      { name: "PostgreSQL", value: 78 },
      { name: "Rust", value: 70 },
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

      <View style={styles.container}>
        {skillCategories.map((category) => (
          <View
            key={category.title}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.categoryTitle, { color: colors.secondaryText }]}>
              {category.title}
            </Text>

            <View style={styles.skillList}>
              {category.skills.map((skill) => (
                <View key={skill.name} style={styles.skillRow}>
                  <View style={styles.skillLabelRow}>
                    <Text style={[styles.skillName, { color: colors.text }]}>
                      {skill.name}
                    </Text>
                    <Text style={[styles.skillValue, { color: colors.secondaryText }]}>
                      {skill.value}%
                    </Text>
                  </View>
                  <View style={[styles.track, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.fill,
                        { width: `${skill.value}%`, backgroundColor: colors.primary },
                      ]}
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  skillList: {
    gap: 14,
  },
  skillRow: {
    gap: 8,
  },
  skillLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillName: {
    fontSize: 15,
    fontWeight: "600",
  },
  skillValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
});