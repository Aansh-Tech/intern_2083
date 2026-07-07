import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Code2, ArrowUpRight } from "lucide-react";
import { Badge } from "../../../common/components/Badge";
import { Button } from "../../../common/components/Button";
import { EmptyState } from "../../../common/components/EmptyState";
import { ProjectGallery } from "../components/ProjectGallery";
import { ROUTES } from "../../../common/constants/routes";
import { getProjectBySlug } from "../services/projects.service";
import type { Project } from "../../../types/project.types";

// Hardcoded mock data as fallback
const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-featured e-commerce platform with payment integration',
    content: 'Detailed project description...',
    category: 'Web Development',
    status: 'completed',
    is_featured: true,
    github_link: 'https://github.com',
    live_link: 'https://example.com',
    image: '/images/project1.jpg',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: 2,
    title: 'Task Management App',
    slug: 'task-management-app',
    description: 'A collaborative task management tool for teams',
    content: 'Detailed project description...',
    category: 'Mobile App',
    status: 'in-progress',
    is_featured: false,
    github_link: 'https://github.com',
    live_link: null,
    image: '/images/project2.jpg',
    created_at: '2024-02-01',
    updated_at: '2024-02-01'
  },
  {
    id: 3,
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    description: 'A modern portfolio website with dark mode',
    content: 'Detailed project description...',
    category: 'Web Design',
    status: 'completed',
    is_featured: true,
    github_link: 'https://github.com',
    live_link: 'https://example.com',
    image: '/images/project3.jpg',
    created_at: '2024-03-01',
    updated_at: '2024-03-01'
  }
];

export function ProjectDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getProjectBySlug(slug);
        setProject(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load project:', err);
        // Fallback to mock data
        const mockProject = MOCK_PROJECTS.find((p) => p.slug === slug);
        if (mockProject) {
          setProject(mockProject);
          setError('Using mock data (API unavailable)');
        } else {
          setProject(null);
          setError('Project not found');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-500 dark:text-slate-400">Loading project...</p>
          </div>
        </div>
      </section>
    );
  }

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
      {error && (
        <div className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
          ⚠️ {error}
        </div>
      )}

      <Link
        to={ROUTES.projects}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {project.category && <Badge tone="slate">{project.category}</Badge>}
        {project.is_featured && <Badge tone="indigo">Featured</Badge>}
        {project.status && (
          <Badge tone={project.status === "completed" ? "green" : "amber"}>
            {project.status === "completed" ? "Completed" : "In Progress"}
          </Badge>
        )}
      </div>

      <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
        {project.title}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
        {project.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.github_link && (
          <a href={project.github_link} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <Code2 className="h-4 w-4" />
              View source
            </Button>
          </a>
        )}
        {project.live_link && (
          <a href={project.live_link} target="_blank" rel="noreferrer">
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