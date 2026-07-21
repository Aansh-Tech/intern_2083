import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import type { DashboardData, ActivityItem } from "../types/dashboard";
import type { Comment } from "../types/comment";
import { useProject } from "./ProjectContext";
import { useInbox } from "./InboxContext";
import { useSkills } from "./SkillsContext";
import { useComment } from "./CommentContext";
import * as dashboardService from "../services/dashboard";


console.log = () => {};
console.info = () => {};
console.debug = () => {};
function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

interface ActivityEntry {
  date: string;
  item: ActivityItem;
}

function generateActivity(
  projects: DashboardData["recentProjects"],
  messages: DashboardData["recentMessages"],
  comments: Comment[],
): ActivityItem[] {
  const entries: ActivityEntry[] = [];

  for (const msg of messages) {
    entries.push({
      date: msg.date,
      item: {
        title: `New message from ${msg.name}`,
        subtitle: formatTimeAgo(msg.date),
        route: "/admin/inbox",
      },
    });
  }

  for (const project of projects) {
    entries.push({
      date: project.dateAdded,
      item: {
        title: project.completed
          ? `${project.title} marked as Completed`
          : `New project: ${project.title}`,
        subtitle: formatTimeAgo(project.dateAdded),
        route: "/admin/projects",
      },
    });
  }

  for (const comment of comments) {
    entries.push({
      date: comment.createdAt,
      item: {
        title: `Comment from ${comment.name}`,
        subtitle: formatTimeAgo(comment.createdAt),
        route: "/admin/comments",
      },
    });
  }

  entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return entries.slice(0, 5).map((e) => e.item);
}

interface DashboardContextType {
  dashboard: DashboardData;
  loading: boolean;
  refreshing: boolean;
  refreshDashboard: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { projects, loading: projectsLoading, refreshProjects } = useProject();
  const { messages, loading: messagesLoading, refreshMessages } = useInbox();
  const { skills, refreshSkills } = useSkills();
  const { comments, refreshComments } = useComment();

  const [blogPosts, setBlogPosts] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchBlogCount = useCallback(async () => {
    try {
      const count = await dashboardService.getBlogCount();
      if (!mountedRef.current) return;
      setBlogPosts(count);
    } catch {
      console.log("Failed to fetch blog count");
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    console.log("[DashboardContext] refreshDashboard() called. busyRef.current:", busyRef.current);
    if (busyRef.current) {
      console.log("[DashboardContext] refreshDashboard() — already busy, returning early");
      return;
    }
    busyRef.current = true;
    setRefreshing(true);
    console.log("[DashboardContext] refreshDashboard() — starting parallel refresh...");
    try {
      await Promise.all([
        refreshProjects(),
        refreshMessages(),
        refreshSkills(),
        refreshComments(),
        fetchBlogCount(),
      ]);
      console.log("[DashboardContext] refreshDashboard() — all parallel refreshes completed");
    } catch (error: any) {
      console.log("[DashboardContext] refreshDashboard() FAILED");
      console.log("[DashboardContext] error.message:", error.message);
      console.log("[DashboardContext] error.stack:", error.stack);
    } finally {
      if (!mountedRef.current) return;
      setRefreshing(false);
      busyRef.current = false;
      console.log("[DashboardContext] refreshDashboard() — finally: refreshing=false, busy=false");
    }
  }, [refreshProjects, refreshMessages, refreshSkills, refreshComments, fetchBlogCount]);

  const dashboard = useMemo(() => {
    const recentProjects = [...projects]
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 5);

    const recentMessages = [...messages]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalProjects: projects.length,
      featuredProjects: projects.filter((p) => p.featured).length,
      totalMessages: messages.length,
      unreadMessages: messages.filter((m) => !m.isRead).length,
      totalSkills: skills.length,
      blogPosts,
      recentProjects,
      recentMessages,
      recentActivity: generateActivity(recentProjects, recentMessages, comments),
    };
  }, [projects, messages, skills, blogPosts, comments]);

  return (
    <DashboardContext.Provider
      value={{
        dashboard,
        loading: projectsLoading || messagesLoading,
        refreshing,
        refreshDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
