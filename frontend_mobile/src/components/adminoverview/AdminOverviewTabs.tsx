// src/components/adminoverview/AdminOverviewTabs.tsx
import { memo } from "react";
import { Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../context/useTheme";
import { useResponsiveContainer } from "../../utils/responsive";

const tabs = [
  { label: "Overview", route: "adminoverview" },
  { label: "Projects", route: "projects" },
  { label: "Blog", route: "blog" },
  { label: "Inbox", route: "inbox" },
  { label: "Comments", route: "comments" },
  { label: "Certificates", route: "certificates" },
  { label: "Skills", route: "skills" },
  { label: "About", route: "about" },
];

interface AdminOverviewTabsProps {
  activeTab: string;
  onTabChange: (route: string) => void;
}

function AdminOverviewTabs({ activeTab, onTabChange }: AdminOverviewTabsProps) {
  const { colors } = useTheme();
  const container = useResponsiveContainer();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[container, styles.scroll]}
      contentContainerStyle={styles.content}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.route;

        return (
          <TouchableOpacity
            key={tab.route}
            className="h-[36px] rounded-full px-4 items-center justify-center"
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderWidth: isActive ? 0 : 1,
                borderColor: colors.border,
              },
            ]}
            onPress={() => { if (!isActive) onTabChange(tab.route); }}
            activeOpacity={0.7}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{ color: isActive ? colors.text : colors.secondaryText }}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexGrow: 1,
  },
  tab: {
    flexGrow: 1,
    flexShrink: 0,
  },
});

export default memo(AdminOverviewTabs);