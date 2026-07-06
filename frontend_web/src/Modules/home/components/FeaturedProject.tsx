import type { Project } from "../../../types/project.types";
import { ProjectCard } from "../../projects/components/ProjectCard";
import { EmptyState } from "../../../common/components/EmptyState";

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Featured work
      </h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        A few projects I'm proud to have shipped.
      </p>

      {projects.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No featured projects yet"
            description="Mark a project as featured from the admin dashboard to show it here."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}