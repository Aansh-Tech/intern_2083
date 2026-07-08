import { useState } from "react";
import type { Project } from "@/types/project.types";

type FilterTab = "all" | "featured" | "completed" | "in_progress";

interface ProjectFilterTabsProps {
  projects: Project[];
  onFilteredChange: (filtered: Project[]) => void;
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "featured", label: "Featured" },
  { key: "completed", label: "Completed" },
  { key: "in_progress", label: "In Progress" },
];

export function ProjectFilterTabs({ projects, onFilteredChange }: ProjectFilterTabsProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  function applyFilter(tab: FilterTab) {
    setActiveTab(tab);

    let filtered = projects;

    // NOTE: client-side filtering because backend's `status` field is
    // ambiguous — it's currently used for published/draft visibility,
    // not confirmed to also carry Completed/In-Progress state.
    // This assumes `status` values might literally be "completed" /
    // "in_progress" strings — CONFIRM with backend dev before relying
    // on this. If status only ever means published/draft, this filter
    // tab needs backend to add a real field (e.g. `progress_status`).
    if (tab === "featured") {
      filtered = projects.filter((p) => p.is_featured);
    } else if (tab === "completed") {
      filtered = projects.filter((p) => p.status === "completed");
    } else if (tab === "in_progress") {
      filtered = projects.filter((p) => p.status === "in_progress");
    }

    onFilteredChange(filtered);
  }

  return (
    <div className="flex gap-2 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => applyFilter(tab.key)}
          className={`px-4 py-2 rounded-full text-sm border ${
            activeTab === tab.key
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}