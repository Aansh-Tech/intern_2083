// modules/projects/pages/ProjectsDetailsPage.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Code2, Link2 } from "lucide-react";
import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import { Badge } from "@/common/components/Badge";
import { ProjectsGallery } from "../components/ProjectsGallery";
import { projectsService } from "../Services/projects.service";
import type { Project } from "@/types/project.types";

export function ProjectsDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    projectsService
      .getBySlug(slug)
      .then((data) => {
        if (isMounted) setProject(data);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : "Project not found.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {isLoading && <Loader />}
      {error && <EmptyState title="Couldn't load project" description={error} />}

      {!isLoading && !error && project && (
        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            {project.is_featured && <Badge>Featured</Badge>}
            <Badge>{project.status}</Badge>
            {project.category && <Badge>{project.category}</Badge>}
          </div>

          <h1 className="text-3xl font-semibold text-foreground">{project.title}</h1>

          {project.images && project.images.length > 0 && (
            <ProjectsGallery images={project.images} />
          )}

          <p className="text-foreground">{project.description}</p>

          <div className="flex gap-4">
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <Code2 size={16} />
                View code
              </a>
            )}
            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <Link2 size={16} />
                Live demo
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}