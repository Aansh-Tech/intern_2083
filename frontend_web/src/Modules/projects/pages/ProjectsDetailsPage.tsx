import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Code2, ArrowUpRight } from "lucide-react";
import { Badge } from "../../../common/components/Badge";
import { Button } from "../../../common/components/Button";
import { EmptyState } from "../../../common/components/EmptyState";
import { ProjectGallery } from "../components/ProjectGallery";
import { ROUTES } from "../../../common/constants/routes";
import { mockProjects } from "../mock/projects.mock";

// TODO: once the API is ready, replace this with:
// const { data: project } = useQuery(["projects", slug], () => projectsService.getBySlug(slug));

export function ProjectDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = mockProjects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20">
        <EmptyState
          title="Project not found"
          description="This project may have been removed or the link is incorrect."
        />
        <Link to={ROUTES.projects} className="mt-6 inline-block">
          <Button variant="outline">Back to projects</Button>
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-20">
      <Link
        to={ROUTES.projects}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge tone="slate">{project.category}</Badge>
        {project.isFeatured && <Badge tone="indigo">Featured</Badge>}
        <Badge tone={project.status === "completed" ? "green" : "amber"}>
          {project.status === "completed" ? "Completed" : "In Progress"}
        </Badge>
      </div>

      <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
        {project.title}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
        {project.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.githubLink && (
          <a href={project.githubLink} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <Code2 className="h-4 w-4" />
              View source
            </Button>
          </a>
        )}
        {project.liveLink && (
          <a href={project.liveLink} target="_blank" rel="noreferrer">
            <Button variant="primary" size="sm">
              Live demo
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </a>
        )}
      </div>

      <div className="mt-10">
        <ProjectGallery images={project.images ?? []} />
      </div>

      {project.content && (
        <div className="mt-10 space-y-4">
          {project.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-slate-600 dark:text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}
