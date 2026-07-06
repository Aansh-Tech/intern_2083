import { Link } from "react-router-dom";
import { Code2, ArrowUpRight } from "lucide-react";
import { Card } from "../../../common/components/Card";
import { Badge } from "../../../common/components/Badge";
import { ROUTES } from "../../../common/constants/routes";
import type { Project } from "../../../types/project.types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="slate">{project.category}</Badge>
          {project.isFeatured && <Badge tone="indigo">Featured</Badge>}
          <Badge tone={project.status === "completed" ? "green" : "amber"}>
            {project.status === "completed" ? "Completed" : "In Progress"}
          </Badge>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {project.description}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-5">
        <Link
          to={ROUTES.projectDetails(project.slug)}
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>

        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <Code2 className="h-3.5 w-3.5" />
            GitHub
          </a>
        )}
      </div>
    </Card>
  );
}
