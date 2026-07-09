import { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowUpRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/useTheme";

interface BlogCardProps {
  date: string;
  title: string;
  link: string;
}

function BlogCard({ date, title, link }: BlogCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between rounded-[20] border p-5"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
      onPress={() => router.push(link as any)}
      activeOpacity={0.7}
    >
      <View className="flex-1 gap-1.5 mr-3">
        <Text className="text-xs font-medium" style={{ color: colors.secondaryText }}>{date}</Text>
        <Text className="text-base font-semibold leading-[22]" style={{ color: colors.text }} numberOfLines={2}>
          {title}
        </Text>
      </View>
      <View
        className="w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ArrowUpRight size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

export default memo(BlogCard);