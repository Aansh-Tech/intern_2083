export type ProjectFilter = "all" | "featured" | "completed" | "in-progress";

interface ProjectFilterTabsProps {
  active: ProjectFilter;
  onChange: (filter: ProjectFilter) => void;
}

const FILTERS: { label: string; value: ProjectFilter }[] = [
  { label: "All", value: "all" },
  { label: "Featured", value: "featured" },
  { label: "Completed", value: "completed" },
  { label: "In Progress", value: "in-progress" },
];

export function ProjectFilterTabs({ active, onChange }: ProjectFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = active === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
