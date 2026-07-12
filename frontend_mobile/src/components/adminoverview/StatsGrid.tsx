import { memo } from "react";
import { View } from "react-native";
import { Folder, Inbox, Star, Eye } from "lucide-react-native";
import DashboardStatCard from "./DashboardStatCard";

const statsData = [
  { icon: Folder, value: "4", label: "Projects", badge: "+1", badgeColor: "#8B83FF", iconBgColor: "#8B83FF" },
  { icon: Inbox, value: "3", label: "Messages", badge: "2 new", badgeColor: "#22C55E", iconBgColor: "#22C55E" },
  { icon: Star, value: "2", label: "Featured", badge: "50%", badgeColor: "#F97316", iconBgColor: "#F97316" },
  { icon: Eye, value: "1.2k", label: "Views (7d)", badge: "+18%", badgeColor: "#8B83FF", iconBgColor: "#8B83FF" },
] as const;

function StatsGrid() {
  return (
    <View className="px-5 pt-2 pb-4">
      <View className="flex-row gap-3">
        <View className="flex-1 gap-3">
          <DashboardStatCard {...statsData[0]} />
          <DashboardStatCard {...statsData[2]} />
        </View>
        <View className="flex-1 gap-3">
          <DashboardStatCard {...statsData[1]} />
          <DashboardStatCard {...statsData[3]} />
        </View>
      </View>
    </View>
  );
}

export default memo(StatsGrid);
