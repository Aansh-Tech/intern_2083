import type { Project } from "./project";
import type { InboxMessage } from "./inbox";

export interface ActivityItem {
  title: string;
  subtitle: string;
  route: string;
}

export interface DashboardData {
  totalProjects: number;
  featuredProjects: number;
  totalMessages: number;
  unreadMessages: number;
  totalSkills: number;
  blogPosts: number;
  recentProjects: Project[];
  recentMessages: InboxMessage[];
  recentActivity: ActivityItem[];
}
