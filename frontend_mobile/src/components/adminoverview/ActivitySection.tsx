import { memo } from "react";
import { View, Text } from "react-native";
import ActivityItem from "./ActivityItem";
import { useTheme } from "../../context/useTheme";

const activityData = [
  { title: "New message from Sarah Jenkins", subtitle: "2 hours ago" },
  { title: "Vortex Engine marked as Completed", subtitle: "Yesterday" },
  { title: "Aura Mobile screenshots updated", subtitle: "3 days ago" },
] as const;

function ActivitySection() {
  const { colors } = useTheme();

  return (
    <>
      <View className="px-5 pt-8 pb-3">
        <Text className="text-[11px] font-bold tracking-[1.5px]" style={{ color: colors.primary }}>
          RECENT ACTIVITY
        </Text>
      </View>
      <View
        className="mx-5 rounded-3xl border mb-8 px-5"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {activityData.map((item, index) => (
          <ActivityItem
            key={item.title}
            title={item.title}
            subtitle={item.subtitle}
            isLast={index === activityData.length - 1}
          />
        ))}
      </View>
    </>
  );
}

export default memo(ActivitySection);
