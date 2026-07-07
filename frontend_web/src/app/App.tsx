import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProjectCard } from '../components/Card';
import { ProjectFilterTabs } from '../components/ProjectFilterTabs';
import { EmptyState } from '../../../common/components/EmptyState';
import { getProjects } from '../services/projects.service';
import type { Project } from '../../../types/project.types';

// Hardcoded mock data for when API fails (optional)
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

export function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        setProjects(response.data);
        setFilteredProjects(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load projects:', err);
        // Use mock data if API fails
        setProjects(MOCK_PROJECTS);
        setFilteredProjects(MOCK_PROJECTS);
        setError('Using mock data (API unavailable)');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filter projects
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else if (activeFilter === 'featured') {
      setFilteredProjects(projects.filter(p => p.is_featured));
    } else {
      setFilteredProjects(projects.filter(p => p.status === activeFilter));
    }
  }, [activeFilter, projects]);

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-500 dark:text-slate-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          Projects
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Explore my work and projects
        </p>
        {error && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      <ProjectFilterTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Try adjusting your filters or check back later."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="transition-transform hover:scale-[1.02]"
            >
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}