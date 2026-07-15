import { Link } from "react-router-dom";
import { Card } from "@/common/components/Card";
import { Badge } from "@/common/components/Badge";
import { Code2 } from "lucide-react";
import { ROUTES } from "@/common/constants/routes";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";
import type { Project } from "@/types/project.types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const thumbnail = project.images?.find((img) => img.is_primary) ?? project.images?.[0];
  const thumbnailSrc = resolveMediaUrl(thumbnail?.image?.url);

  return (
    <Card>
      <Link to={`${ROUTES.projects}/${project.slug}`} className="block">
        {thumbnailSrc && (
          <img
            src={thumbnailSrc}
            alt={project.title}
            className="mb-3 w-full aspect-video rounded-lg object-cover"
          />
        )}

        <div className="flex gap-2 mb-3">
          {project.is_featured && <Badge>Featured</Badge>}
          <Badge>{project.status}</Badge>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </Link>

      {project.github_link && (
        <a
          href={project.github_link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <Code2 size={16} />
          View code
        </a>
      )}
    </Card>
  );
}