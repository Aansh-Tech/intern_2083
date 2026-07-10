export interface Project {
  id: number;
  profile_id: number;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  content?: string;
  github_link?: string;
  live_link?: string;
  technologies?: string;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  completed_at?: string;
  created_at: string;
}