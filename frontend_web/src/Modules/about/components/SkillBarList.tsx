import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import type { Skill } from "@/types/skill.types";

interface SkillBarListProps {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
}

const FALLBACK_CATEGORY = "Skills";

export function SkillBarList({ skills, isLoading, error }: SkillBarListProps) {
  if (isLoading) return <Loader />;
  if (error) return <EmptyState title="Couldn't load skills" description={error} />;
  if (skills.length === 0) return <EmptyState title="No skills yet" description="Nothing added yet." />;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const category = skill.category ?? FALLBACK_CATEGORY;
    acc[category] = acc[category] ?? [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {category}
          </h3>
          <div className="flex flex-col gap-3">
            {categorySkills.map((skill) => (
              <div key={skill.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{skill.name}</span>
                  {typeof skill.percentage === "number" && (
                    <span className="text-muted-foreground">{skill.percentage}%</span>
                  )}
                </div>
                <div className="h-2 w-full rounded-full bg-border">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${skill.percentage ?? 0}%` }}
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