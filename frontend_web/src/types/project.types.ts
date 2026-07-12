export type ProjectStatus = "draft" | "published" | "archived";

export interface Project {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  content?: string;
  github_link?: string;
  live_link?: string;
  technologies?: string[];
  is_featured: boolean;
  status: ProjectStatus;
  completed_at?: string;
}