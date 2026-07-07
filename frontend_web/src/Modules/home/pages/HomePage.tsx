import { useState, useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import { FeaturedProjects } from "../components/FeaturedProjects";
import { ToolkitSection } from "../components/ToolkitSection";
import { LatestBlogPosts } from "../components/LatestBlogPosts";
import { getFeaturedProjects } from "../../projects/services/projects.service";
import { getSkills } from "../../about/services/about.service";
import { getLatestPosts } from "../services/home.service";
import type { Project } from "../../../types/project.types";
import type { Skill } from "../../../types/skill.types";
import type { BlogPost } from "../../../types/blogPost.types";

// Hardcoded mock data as fallback
const MOCK_FEATURED_PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    description: "A full-featured e-commerce platform with payment integration",
    content: "Detailed project description...",
    category: "Web Development",
    status: "completed",
    is_featured: true,
    github_link: "https://github.com",
    live_link: "https://example.com",
    image: "/images/project1.jpg",
    created_at: "2024-01-15",
    updated_at: "2024-01-15"
  },
  {
    id: 2,
    title: "Portfolio Website",
    slug: "portfolio-website",
    description: "A modern portfolio website with dark mode",
    content: "Detailed project description...",
    category: "Web Design",
    status: "completed",
    is_featured: true,
    github_link: "https://github.com",
    live_link: "https://example.com",
    image: "/images/project3.jpg",
    created_at: "2024-03-01",
    updated_at: "2024-03-01"
  },
  {
    id: 3,
    title: "Task Management App",
    slug: "task-management-app",
    description: "A collaborative task management tool for teams",
    content: "Detailed project description...",
    category: "Mobile App",
    status: "in-progress",
    is_featured: false,
    github_link: "https://github.com",
    live_link: null,
    image: "/images/project2.jpg",
    created_at: "2024-02-01",
    updated_at: "2024-02-01"
  }
];

const MOCK_SKILLS: Skill[] = [
  {
    id: 1,
    profile_id: 1,
    name: "React",
    photo: "/icons/react.svg",
    display_order: 1,
    percentage: 90,
    category: "Frontend"
  },
  {
    id: 2,
    profile_id: 1,
    name: "TypeScript",
    photo: "/icons/typescript.svg",
    display_order: 2,
    percentage: 85,
    category: "Frontend"
  },
  {
    id: 3,
    profile_id: 1,
    name: "Tailwind CSS",
    photo: "/icons/tailwind.svg",
    display_order: 3,
    percentage: 80,
    category: "Frontend"
  },
  {
    id: 4,
    profile_id: 1,
    name: "Laravel",
    photo: "/icons/laravel.svg",
    display_order: 4,
    percentage: 75,
    category: "Backend"
  },
  {
    id: 5,
    profile_id: 1,
    name: "Figma",
    photo: "/icons/figma.svg",
    display_order: 5,
    percentage: 60,
    category: "Design"
  }
];

const MOCK_LATEST_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    slug: "getting-started-with-react-typescript",
    excerpt: "Learn how to build type-safe React applications with TypeScript",
    content: "Full blog content here...",
    cover_image: "/images/blog1.jpg",
    published_at: "2024-01-15",
    status: "published",
    author: "Marchetti",
    created_at: "2024-01-15",
    updated_at: "2024-01-15"
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS in 2024",
    slug: "mastering-tailwind-css-2024",
    excerpt: "Advanced techniques for building beautiful UIs with Tailwind",
    content: "Full blog content here...",
    cover_image: "/images/blog2.jpg",
    published_at: "2024-02-01",
    status: "published",
    author: "Marchetti",
    created_at: "2024-02-01",
    updated_at: "2024-02-01"
  },
  {
    id: 3,
    title: "Building a Personal Portfolio with React",
    slug: "building-personal-portfolio-react",
    excerpt: "Step by step guide to creating your own portfolio website",
    content: "Full blog content here...",
    cover_image: "/images/blog3.jpg",
    published_at: "2024-03-01",
    status: "published",
    author: "Marchetti",
    created_at: "2024-03-01",
    updated_at: "2024-03-01"
  }
];

export function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let hasError = false;
        let errorMessage = '';

        // Load featured projects
        try {
          const projectsResponse = await getFeaturedProjects();
          setFeaturedProjects(projectsResponse.data);
        } catch (projectsErr) {
          console.error('Failed to load featured projects:', projectsErr);
          setFeaturedProjects(MOCK_FEATURED_PROJECTS);
          hasError = true;
          errorMessage = 'Using mock data for projects (API unavailable)';
        }

        // Load skills
        try {
          const skillsResponse = await getSkills();
          setSkills(skillsResponse.data);
        } catch (skillsErr) {
          console.error('Failed to load skills:', skillsErr);
          setSkills(MOCK_SKILLS);
          hasError = true;
          if (!errorMessage) errorMessage = 'Using mock data for skills (API unavailable)';
        }

        // Load latest blog posts
        try {
          const postsResponse = await getLatestPosts();
          setLatestPosts(postsResponse.data);
        } catch (postsErr) {
          console.error('Failed to load latest posts:', postsErr);
          setLatestPosts(MOCK_LATEST_POSTS);
          hasError = true;
          if (!errorMessage) errorMessage = 'Using mock data for blog posts (API unavailable)';
        }

        setError(hasError ? errorMessage : null);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load home page data:', err);
        // Fallback to all mock data
        setFeaturedProjects(MOCK_FEATURED_PROJECTS);
        setSkills(MOCK_SKILLS);
        setLatestPosts(MOCK_LATEST_POSTS);
        setError('Using mock data (API unavailable)');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
            ⚠️ {error}
          </div>
        </div>
      )}
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <ToolkitSection skills={skills} />
      <LatestBlogPosts posts={latestPosts} />
    </>
  );
}