import { useEffect, useState } from "react";
import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectFilterTabs, type ProjectFilter } from "../components/ProjectFilterTabs";
import { projectsService } from "../Services/projects.service";
import type { Project } from "@/types/project.types";

export function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all");

  useEffect(() => {
    let isMounted = true;

    projectsService
      .getAll()
      .then((data) => {
        if (isMounted) setProjects(data);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load projects.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = projects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "featured") return project.is_featured;
    return true; // "completed" / "in-progress" not supported yet
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Projects</h1>

      {isLoading && <Loader />}
      {error && <EmptyState title="Couldn't load projects" description={error} />}

      {!isLoading && !error && (
        <>
          <ProjectFilterTabs active={activeFilter} onChange={setActiveFilter} />

          {filtered.length === 0 ? (
            <EmptyState title="No projects match this filter" description="Try another tab." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}