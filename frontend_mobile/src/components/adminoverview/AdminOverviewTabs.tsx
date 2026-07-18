// src/components/adminoverview/AdminOverviewTabs.tsx
import { memo } from "react";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../../context/useTheme";

const tabs = [
  { label: "Overview", route: "adminoverview" },
  { label: "Projects", route: "projects" },
  { label: "Blog", route: "blog" },
  { label: "Inbox", route: "inbox" },
  { label: "Comments", route: "comments" },
  { label: "Skills", route: "skills" },
  { label: "About", route: "about" },
];

interface AdminOverviewTabsProps {
  activeTab: string;
  onTabChange: (route: string) => void;
}

function AdminOverviewTabs({ activeTab, onTabChange }: AdminOverviewTabsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-5 gap-2"
      className="py-5"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.route;

        return (
          <TouchableOpacity
            key={tab.route}
            className="h-[36px] rounded-full px-4 items-center justify-center"
            style={{
              backgroundColor: isActive ? colors.primary : colors.card,
              borderWidth: isActive ? 0 : 1,
              borderColor: colors.border,
            }}
            onPress={() => { if (!isActive) onTabChange(tab.route); }}
            activeOpacity={0.7}
          >
            <Text
              className="text-[13px] font-semibold"
              style={{ color: isActive ? colors.text : colors.secondaryText }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default memo(AdminOverviewTabs);