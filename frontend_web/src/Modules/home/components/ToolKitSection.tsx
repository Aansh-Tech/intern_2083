import { SkillBarList } from "@/Modules/about/components/SkillBarList";
import type { Skill } from "@/types/skill.types";

interface ToolKitSectionProps {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
}

export function ToolKitSection({ skills, isLoading, error }: ToolKitSectionProps) {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Toolkit</h2>
      <SkillBarList skills={skills} isLoading={isLoading} error={error} />
    </section>
  );
}