import { useEffect, useState } from "react";
import { projectsService } from "../../../projects/Services/projects.service";

interface OverviewStats {
  totalProjects: number;
  featuredProjects: number;
}

export function DashboardOverviewPage() {
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
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Dashboard
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Overview of your portfolio content.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Projects"
          value={loading ? "…" : stats?.totalProjects ?? 0}
        />
        <StatCard
          label="Featured Projects"
          value={loading ? "…" : stats?.featuredProjects ?? 0}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}