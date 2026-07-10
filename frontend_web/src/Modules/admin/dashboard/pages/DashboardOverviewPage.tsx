// src/Modules/admin/dashboard/pages/DashboardOverviewPage.tsx
import { useEffect, useState } from "react";
import { Folder, Sparkles, FileText, MessageSquare, Mail } from "lucide-react";
import { projectsService } from "../../../projects/Services/projects.service";
import { useAuth } from "../../../../common/hooks/useAuth";

interface OverviewStats {
  totalProjects: number;
  featuredProjects: number;
}

export function DashboardOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const projects = await projectsService.getAll();
        setStats({
          totalProjects: projects.length,
          featuredProjects: projects.filter((p) => p.is_featured).length,
        });
      } catch {
        setStats({ totalProjects: 0, featuredProjects: 0 });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
        Overview
      </p>
      <h1 className="mt-1 text-3xl font-bold">
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Here's what's happening across the site today.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={Folder}
          label="Total Projects"
          value={loading ? "…" : stats?.totalProjects ?? 0}
        />
        <StatCard
          icon={Sparkles}
          label="Featured"
          value={loading ? "…" : stats?.featuredProjects ?? 0}
        />
        <StatCard icon={FileText} label="Blog Posts" value="—" />
        <StatCard icon={MessageSquare} label="Pending Comments" value="—" />
        <StatCard icon={Mail} label="Unread Messages" value="—" />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Folder;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <Icon className="h-4 w-4 text-slate-300 dark:text-slate-600" />
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}