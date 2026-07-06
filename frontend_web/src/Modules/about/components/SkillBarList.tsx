import type { Skill } from "../../../types/skill.types";

interface SkillBarListProps {
  skills: Skill[];
}

export function SkillBarList({ skills }: SkillBarListProps) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="grid gap-10 md:grid-cols-3">
      {categories.map((category) => (
        <div key={category}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {category}
          </h3>
          <div className="space-y-5">
            {skills
              .filter((skill) => skill.category === category)
              .map((skill) => (
                <div key={skill.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {skill.name}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {skill.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all dark:bg-indigo-400"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}