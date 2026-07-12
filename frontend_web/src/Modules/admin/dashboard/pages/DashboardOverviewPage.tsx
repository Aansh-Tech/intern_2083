import { useEffect, useState } from "react";
import { Folder, Sparkles } from "lucide-react";
import { projectsService } from "@/Modules/projects/Services/projects.service";
import { useAuth } from "@/common/hooks/useAuth";

export function DashboardOverviewPage() {
  const { user } = useAuth();
  const [totalProjects, setTotalProjects] = useState<number | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<number | null>(null);

  useEffect(() => {
    projectsService.getAll()
      .then((projects) => {
        setTotalProjects(projects.length);
        setFeaturedProjects(projects.filter((p) => p.is_featured).length);
      })
      .catch(() => {
        setTotalProjects(0);
        setFeaturedProjects(0);
      });
  }, []);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Overview</p>
      <h1 className="mt-1 text-3xl font-bold">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Here's what's happening across the site today.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Folder} label="Total Projects" value={totalProjects ?? "…"} />
        <StatCard icon={Sparkles} label="Featured" value={featuredProjects ?? "…"} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Folder; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-slate-300 dark:text-slate-600" />
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}