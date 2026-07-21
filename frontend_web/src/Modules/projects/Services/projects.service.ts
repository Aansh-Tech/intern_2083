import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/services/apiResponse.types";
import type { Project } from "@/types/project.types";

export const projectsService = {
  // LIVE — GET /projects (filters status === 'published' server-side)
  async getAll(): Promise<Project[]> {
    const { data } = await apiClient.get<ApiResponse<Project[]>>(ENDPOINTS.projects);
    return data.data;
  },

  // LIVE — GET /projects/featured (limit 3, is_featured = true)
  // ⚠️ Backend route ordering matters: /projects/featured MUST be registered
  // before /projects/{slug} in routes/api.php, or Laravel treats "featured"
  // as a slug param and 404s. Flag to backend if this ever breaks.
  async getFeatured(): Promise<Project[]> {
    const { data } = await apiClient.get<ApiResponse<Project[]>>(ENDPOINTS.projectsFeatured);
    return data.data;
  },

  // LIVE — GET /projects/{slug}
  async getBySlug(slug: string): Promise<Project> {
    const { data } = await apiClient.get<ApiResponse<Project>>(
      `${ENDPOINTS.projects}/${slug}`
    );
    return data.data;
  },
};