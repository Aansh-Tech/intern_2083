import type { Skill } from "../../../types/skill.types";
import type { Project } from "../../../types/project.types";
import type { BlogPost } from "../../../types/blogPost.types";

export const mockSkills: Skill[] = [
  { id: "1", profile_id: "1", name: "React & Next.js", category: "Frontend", percentage: 95 },
  { id: "2", profile_id: "1", name: "TypeScript", category: "Frontend", percentage: 90 },
  { id: "3", profile_id: "1", name: "Tailwind CSS", category: "Frontend", percentage: 92 },
  { id: "4", profile_id: "1", name: "Node.js", category: "Backend", percentage: 85 },
  { id: "5", profile_id: "1", name: "Laravel", category: "Backend", percentage: 80 },
  { id: "6", profile_id: "1", name: "Figma", category: "Design", percentage: 75 },
];

export const mockFeaturedProjects: Project[] = [
  {
    id: "1",
    slug: "vortex-engine",
    title: "Vortex Engine",
    category: "Developer Tools",
    description: "A high-performance build engine for modern web apps.",
    status: "completed",
    is_featured: true,
    github_link: "https://github.com",
    live_link: "https://example.com",
  },
  {
    id: "2",
    slug: "quietly",
    title: "Quietly",
    category: "Design System",
    description: "A calm, accessible design system for internal tools.",
    status: "in-progress",
    is_featured: true,
    github_link: "https://github.com",
  },
];

export const mockLatestPosts: BlogPost[] = [
  {
    id: "1",
    slug: "designing-for-quiet-interfaces",
    title: "Designing for Quiet Interfaces",
    excerpt: "Why restraint is the hardest and most valuable design skill.",
    content: "",
    publishedAt: "2026-06-12",
  },
  {
    id: "2",
    slug: "state-management-in-2026",
    title: "State Management in 2026",
    excerpt: "A practical look at where the ecosystem has settled.",
    content: "",
    publishedAt: "2026-05-28",
  },
  {
    id: "3",
    slug: "shipping-fast-without-breaking-things",
    title: "Shipping Fast Without Breaking Things",
    excerpt: "Notes on velocity, testing, and trust in small teams.",
    content: "",
    publishedAt: "2026-05-10",
  },
];