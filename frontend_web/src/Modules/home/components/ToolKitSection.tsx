import type { Skill } from "../../../types/skill.types";
import { SkillBarList } from "../../about/components/SkillBarList";

interface ToolkitSectionProps {
  skills: Skill[];
}

export function ToolkitSection({ skills }: ToolkitSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Toolkit
      </h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Technologies I reach for most often.
      </p>

      <div className="mt-10">
        <SkillBarList skills={skills} />
      </div>
    </section>
  );
}