import api from "./api";
import { resolveImageUrl, dedupeImages } from "./image";
import type { ProjectImage } from "../types/project";
import { MAX_PROJECT_PHOTOS } from "../types/project";

console.log = () => {};
console.info = () => {};
console.debug = () => {};

function mapProjectImages(images: any[] | undefined): ProjectImage[] {
  if (!images || !Array.isArray(images)) return [];
  const mapped = images
    .map((img: any) => {
      const rawUrl = img.image?.url || img.url || img.path || "";
      if (!rawUrl) return null;
      return {
        id: String(img.id),
        url: resolveImageUrl(rawUrl),
        displayOrder: img.display_order ?? img.displayOrder,
        isPrimary: img.is_primary ?? img.isPrimary,
      } as ProjectImage;
    })
    .filter(Boolean) as ProjectImage[];
  return dedupeImages(mapped).slice(0, MAX_PROJECT_PHOTOS);
}

function primaryImageUrl(images: ProjectImage[], fallback: any): string | undefined {
  if (fallback) return fallback;
  return images?.[0]?.url ?? undefined;
}

export async function getProjects(admin = false) {
  const endpoint = admin ? "/v1/admin/projects" : "/v1/projects";

  const response = await api.get(endpoint);

  return response.data.data.map((project: any) => {
    const images = mapProjectImages(project.images);

    return {
      id: String(project.id),

      title: project.title,
      slug: project.slug,

      category: project.subtitle ?? "",

      description: project.description,

      status:
        project.status === "published"
          ? "completed"
          : "in-progress",

      featured: project.is_featured,

      githubUrl: project.github_link,

      viewDetailsUrl: project.live_link,

      technologies:
        typeof project.technologies === "string"
          ? project.technologies
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],

      gradient: ["#5B5FEF", "#2F8AFE"],

      completed: project.status === "published",

      image: primaryImageUrl(images, project.image),
      images,

      displayOrder: project.id,

      dateAdded: project.created_at,
      updatedAt: project.updated_at || undefined,
    };
  });
}

export async function getProject(id: string, admin = false) {
  const response = await api.get(admin ? `/v1/admin/projects/${id}` : `/v1/projects/${id}`);
  const project = response.data.data;
  const images = mapProjectImages(project.images);

  return {
    id: String(project.id),
    title: project.title,
    slug: project.slug,
    category: project.subtitle ?? "",
    description: project.description,
    status: project.status === "published" ? "completed" as const : "in-progress" as const,
    featured: project.is_featured,
    technologies: typeof project.technologies === "string"
      ? project.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [],
    gradient: ["#5B5FEF", "#2F8AFE"] as [string, string],
    githubUrl: project.github_link,
    viewDetailsUrl: project.live_link,
    image: primaryImageUrl(images, project.image),
    images,
    displayOrder: project.id,
    dateAdded: project.created_at,
    updatedAt: project.updated_at || undefined,
    completed: project.status === "published",
  };
}

/**
 * Maps the mobile form shape ({ title, category, description, githubUrl,
 * viewDetailsUrl, featured, completed, ... }) onto the fields the Laravel
 * backend accepts/validates for project create + update. Shared by both so an
 * edit persists every field (previously edits only sent camelCase keys that the
 * backend dropped, so category/links/featured/completed were lost on update).
 */
export function buildProjectPayload(data: any) {
  return {
    title: data.title,

    slug:
      typeof data.slug === "string" && data.slug.trim()
        ? data.slug.trim()
        : data.title
          ? data.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : "",

    subtitle: data.category ?? "",

    description: data.description,

    content: data.description,

    github_link: data.githubUrl ?? null,

    live_link: data.viewDetailsUrl ?? null,

    technologies: Array.isArray(data.technologies)
      ? data.technologies.join(",")
      : "",

    is_featured: !!data.featured,

    status: data.completed ? "published" : "draft",

    completed_at: data.completed
      ? new Date().toISOString().split("T")[0]
      : null,
  };
}

export async function createProject(data: any) {
  const payload = buildProjectPayload(data);

  console.log("Sending:", payload);

  try {
    const response = await api.post("/v1/projects", payload);

    console.log("SUCCESS:", response.status);
    console.log("DATA:", response.data);

    return response.data.data;
  } catch (error: any) {
    console.log("STATUS:", error.response?.status);
    console.log("ERROR:", error.response?.data);

    throw error;
  }
}

export async function updateProject(id: string, data: any) {
  const response = await api.put(`/v1/projects/${id}`, data);
  return response.data.data;
}

export async function deleteProject(id: string) {
  await api.delete(`/v1/projects/${id}`);
}