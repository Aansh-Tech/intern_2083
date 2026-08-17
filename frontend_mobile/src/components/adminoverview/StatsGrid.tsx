import { memo } from "react";
import { View } from "react-native";
import { Folder, Inbox, Star, Eye } from "lucide-react-native";
import DashboardStatCard from "./DashboardStatCard";
import type { DashboardData } from "../../types/dashboard";
import { useResponsiveContainer, useResponsiveColumns, gridCellStyle } from "../../utils/responsive";

interface StatsGridProps {
  data: DashboardData;
}

function StatsGrid({ data }: StatsGridProps) {
  const container = useResponsiveContainer();
  const columns = Math.min(useResponsiveColumns(180, 2), 4);

  const featuredPct = data.totalProjects > 0
    ? Math.round((data.featuredProjects / data.totalProjects) * 100) + "%"
    : "0%";

  const cards = [
    { icon: Folder, value: String(data.totalProjects), label: "Projects", badge: `+${data.featuredProjects}`, badgeColor: "#8B83FF", iconBgColor: "#8B83FF" },
    { icon: Inbox, value: String(data.totalMessages), label: "Messages", badge: `${data.unreadMessages} new`, badgeColor: "#22C55E", iconBgColor: "#22C55E" },
    { icon: Star, value: String(data.featuredProjects), label: "Featured", badge: featuredPct, badgeColor: "#F97316", iconBgColor: "#F97316" },
    { icon: Eye, value: String(data.blogPosts), label: "Blog Posts", badge: data.blogPosts > 0 ? "live" : undefined, badgeColor: "#8B83FF", iconBgColor: "#8B83FF" },
  ] as const;

  return (
    <View style={[container, { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }]}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 12 }}>
        {cards.map((card) => (
          <View key={card.label} style={gridCellStyle(columns, 12)}>
            <DashboardStatCard {...card} />
          </View>
        ))}
      </View>
    </View>
  );
}

export default memo(StatsGrid);