export type ProjectStatus = "completed" | "in-progress" | "draft" | "archived";

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  status: ProjectStatus;
  featured: boolean;
  technologies: string[];
  gradient: [string, string];
  githubUrl?: string;
  viewDetailsUrl?: string;
  image?: string;
  images?: Array<{ id: string; url: string }>;
  displayOrder: number;
  dateAdded: string;
  updatedAt?: string;
  completed?: boolean;
}
