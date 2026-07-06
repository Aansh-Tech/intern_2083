import { useMemo, useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import {
  ProjectFilterTabs,
  type ProjectFilter,
} from "../components/ProjectFilterTabs";
import { EmptyState } from "../../../common/components/EmptyState";
import { mockProjects } from "../mock/projects.mock";

// TODO: once the API is ready, replace mockProjects with:
// const { data: projects } = useQuery(["projects"], projectsService.getAll);

export function ProjectsListPage() {
  const [filter, setFilter] = useState<ProjectFilter>("all");

  const filteredProjects = useMemo(() => {
    if (filter === "all") return mockProjects;
    if (filter === "featured") return mockProjects.filter((p) => p.isFeatured);
    return mockProjects.filter((p) => p.status === filter);
  }, [filter]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Projects
      </h1>
      <p className="mt-2 max-w-lg text-slate-500 dark:text-slate-400">
        A collection of things I've built, from developer tools to design
        systems.
      </p>

      <div className="mt-8">
        <ProjectFilterTabs active={filter} onChange={setFilter} />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No projects match this filter"
            description="Try a different filter or check back once new projects are added."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
