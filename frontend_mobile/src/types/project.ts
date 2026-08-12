export type ProjectStatus = "completed" | "in-progress" | "draft" | "archived";

export const MAX_PROJECT_PHOTOS = 5;

export interface ProjectImage {
  id: string;
  url: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface ProjectPhoto {
  uid: string;
  uri: string;
  id?: string;
  isNew?: boolean;
  order?: number;
}

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
  images?: ProjectImage[];
  displayOrder: number;
  dateAdded: string;
  updatedAt?: string;
  completed?: boolean;
}
