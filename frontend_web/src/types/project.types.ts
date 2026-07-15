export type ProjectStatus = "draft" | "published" | "archived";

export interface ProjectImage {
  id: number;
  type: string;
  display_order: number;
  is_primary: boolean;
  image: {
    id: number;
    filename: string;
    alt_text?: string | null;
    caption?: string | null;
    url: string;
  } | null;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  content?: string;
  github_link?: string;
  live_link?: string;
  technologies?: string;
  is_featured: boolean;
  status: ProjectStatus;
  completed_at?: string;
  images?: ProjectImage[];
  category?: string;
}