import { memo } from "react";
import { View, Text } from "react-native";
import { Folder, Inbox } from "lucide-react-native";
import QuickActionCard from "./QuickActionCard";
import { useTheme } from "../../context/useTheme";

interface QuickActionsSectionProps {
  onManageProjects: () => void;
  onReviewInbox: () => void;
}

function QuickActionsSection({ onManageProjects, onReviewInbox }: QuickActionsSectionProps) {
  const { colors } = useTheme();

  return (
    <>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-[11px] font-bold tracking-[1.5px]" style={{ color: colors.primary }}>
          QUICK ACTIONS
        </Text>
      </View>
      <View className="px-5 gap-3">
        <QuickActionCard
          icon={Folder}
          title="Manage projects"
          subtitle="Add, edit, and reorder featured work."
          onPress={onManageProjects}
        />
        <QuickActionCard
          icon={Inbox}
          title="Review inbox"
          subtitle="2 unread contact submissions."
          badge="2"
          onPress={onReviewInbox}
        />
      </View>
    </>
  );
}

export default memo(QuickActionsSection);
