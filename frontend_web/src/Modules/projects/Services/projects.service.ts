import { apiClient } from "../../../services/apiClient";
import type { ApiResponse } from "../../../services/apiResponse.types";
import type { Project } from "../../../types/project.types";

/**
 * Matches ProjectController exactly:
 *   GET /projects           -> index()    all published projects
 *   GET /projects/featured  -> featured()  up to 3 featured + published
 *   GET /projects/{slug}    -> show($slug) single published project
 *
 * IMPORTANT: register the /projects/featured route BEFORE
 * /projects/{slug} in routes/api.php on the backend, or Laravel will treat
 * "featured" as a slug and it will 404. Flag this to your backend friend
 * if the featured endpoint isn't working.
 */
export const projectsService = {
  async getAll(): Promise<Project[]> {
    const { data } = await apiClient.get<ApiResponse<Project[]>>("/projects");

    if (!data.success) {
      throw new Error(data.message ?? "Failed to load projects");
    }

    return data.data;
  },

  async getFeatured(): Promise<Project[]> {
    const { data } = await apiClient.get<ApiResponse<Project[]>>(
      "/projects/featured"
    );

    if (!data.success) {
      throw new Error(data.message ?? "Failed to load featured projects");
    }

    return data.data;
  },

  async getBySlug(slug: string): Promise<Project | null> {
    try {
      const { data } = await apiClient.get<ApiResponse<Project>>(
        `/projects/${slug}`
      );

      if (!data.success) return null;
      return data.data;
    } catch (error) {
      // controller returns a 404 with { success: false } when not found
      return null;
    }
  },
};