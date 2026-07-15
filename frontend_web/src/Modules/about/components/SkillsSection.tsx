import { useEffect, useState } from "react";
import { skillsService } from "@/Modules/about/services/skills.service";
import type { Skill } from "@/types/skill.types";

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    skillsService
      .getAll()
      .then((data) => isMounted && setSkills(data))
      .catch((err) => isMounted && setError(err instanceof Error ? err.message : "Failed to load skills"))
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <p className="text-slate-500 dark:text-slate-400">Loading skills…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (skills.length === 0) return null;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const category = skill.category ?? "Other";
    (acc[category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Skills &amp; Craft</h2>

      <div className="mt-10 space-y-12">
        {Object.entries(grouped).map(([category, categorySkills]) => (
          <div key={category}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {category}
            </p>
            <div className="mt-5 space-y-6">
              {categorySkills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900 dark:text-white">{skill.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">{skill.proficiency ?? 0}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(0, skill.proficiency ?? 0))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}