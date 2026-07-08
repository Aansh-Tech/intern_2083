import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import { ProjectCard } from "@/Modules/projects/components/ProjectCard";
import type { Project } from "@/types/project.types";

interface FeaturedProjectProps {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export function FeaturedProject({ projects, isLoading, error }: FeaturedProjectProps) {
  if (isLoading) return <Loader />;
  if (error) return <EmptyState title="Couldn't load projects" description={error} />;
  if (projects.length === 0) {
    return <EmptyState title="No featured projects yet" description="Check back soon." />;
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}