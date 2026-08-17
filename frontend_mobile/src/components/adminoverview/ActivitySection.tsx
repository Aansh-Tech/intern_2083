  import { memo } from "react";
import { View, Text } from "react-native";
import ActivityItem from "./ActivityItem";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";
import type { ActivityItem as ActivityItemType } from "../../types/dashboard";

interface ActivitySectionProps {
  activities: ActivityItemType[];
  onActivityPress: (index: number) => void;
}

function ActivitySection({ activities, onActivityPress }: ActivitySectionProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();

  return (
    <>
      <View style={[container, { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 12 }]}>
        <Text className="text-[11px] font-bold tracking-[1.5px]" style={{ color: colors.primary }}>
          RECENT ACTIVITY
        </Text>
      </View>
      <View style={[container, { paddingHorizontal: 20, marginBottom: 32 }]}>
        <View
          style={[
            {
              borderRadius: 24,
              borderWidth: 1,
              paddingHorizontal: 20,
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
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
      </View>
    </>
  );
}

export default memo(ActivitySection);
