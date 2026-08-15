import { memo } from "react";
import { View, Text } from "react-native";
import { Folder, Inbox } from "lucide-react-native";
import QuickActionCard from "./QuickActionCard";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

interface QuickActionsSectionProps {
  onManageProjects: () => void;
  onReviewInbox: () => void;
  unreadCount: number;
}

function QuickActionsSection({ onManageProjects, onReviewInbox, unreadCount }: QuickActionsSectionProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();

  return (
    <>
      <View style={[container, { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }]}>
        <Text className="text-[11px] font-bold tracking-[1.5px]" style={{ color: colors.primary }}>
          QUICK ACTIONS
        </Text>
      </View>
      <View style={[container, { paddingHorizontal: 20, gap: 12 }]}>
        <QuickActionCard
          icon={Folder}
          title="Manage projects"
          subtitle="Add, edit, and reorder featured work."
          onPress={onManageProjects}
        />
        <QuickActionCard
          icon={Inbox}
          title="Review inbox"
          subtitle={`${unreadCount} unread contact submission${unreadCount === 1 ? "" : "s"}.`}
          badge={unreadCount > 0 ? String(unreadCount) : undefined}
          onPress={onReviewInbox}
        />
      </View>
    </>
  );
}

export default memo(QuickActionsSection);
