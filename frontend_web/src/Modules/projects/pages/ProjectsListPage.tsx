// modules/projects/pages/ProjectsListPage.tsx

import { useEffect, useState } from "react";
import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectFilterTabs } from "../components/ProjectFilterTabs";
import { projectsService } from "../Services/projects.service";
import type { Project } from "@/types/project.types";

export function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    projectsService
      .getAll()
      .then((data) => {
        if (!isMounted) return;
        setProjects(data);
        setFiltered(data);
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Projects</h1>

      {isLoading && <Loader />}
      {error && <EmptyState title="Couldn't load projects" description={error} />}

      {!isLoading && !error && (
        <>
          <ProjectFilterTabs projects={projects} onFilteredChange={setFiltered} />

          {filtered.length === 0 ? (
            <EmptyState title="No projects match this filter" description="Try another tab." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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