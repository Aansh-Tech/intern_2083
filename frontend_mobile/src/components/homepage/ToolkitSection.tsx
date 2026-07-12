import { View, Text, TouchableOpacity } from "react-native";
import { Code2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import SkillBar from "./SkillBar";
import { useTheme } from "../../context/useTheme";
import { useSkills } from "../../context/SkillsContext";

export default function ToolkitSection() {
  const { colors } = useTheme();
  const { skills } = useSkills();
  const router = useRouter();

  return (
    <View className="px-5 pt-[60px]">
      <View
        className="rounded-3xl border p-6"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <View className="flex-row justify-between items-start mb-6">
          <View className="gap-1">
            <Text className="text-xs font-bold tracking-[2px]" style={{ color: colors.primary }}>
              TOOLKIT
            </Text>
            <Text className="text-[22px] font-bold" style={{ color: colors.text }}>
              What I work with
            </Text>
          </View>
          <Code2 size={20} color={colors.secondaryText} />
        </View>

        <View className="gap-5">
          {skills.slice(0, 4).map((skill) => (
            <SkillBar key={skill.id} name={skill.name} percentage={skill.percentage} />
          ))}
        </View>

        <TouchableOpacity
          className="h-14 rounded-[28] border items-center justify-center mt-6"
          style={{ borderColor: colors.border }}
          onPress={() => router.push("/(tabs)/project")}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold" style={{ color: colors.text }}>
            See full toolkit →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}