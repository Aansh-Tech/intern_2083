  import { memo } from "react";
import { View, Text } from "react-native";
import ActivityItem from "./ActivityItem";
import { useTheme } from "../../context/useTheme";
import type { ActivityItem as ActivityItemType } from "../../types/dashboard";

interface ActivitySectionProps {
  activities: ActivityItemType[];
  onActivityPress: (index: number) => void;
}

function ActivitySection({ activities, onActivityPress }: ActivitySectionProps) {
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
        {activities.length === 0 ? (
          <View className="py-6">
            <Text className="text-[13px] text-center" style={{ color: colors.secondaryText }}>No recent activity</Text>
          </View>
        ) : (
          activities.map((item, index) => (
            <ActivityItem
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              isLast={index === activities.length - 1}
              onPress={() => onActivityPress(index)}
            />
          ))
        )}
      </View>
    </>
  );
}

export default memo(ActivitySection);
