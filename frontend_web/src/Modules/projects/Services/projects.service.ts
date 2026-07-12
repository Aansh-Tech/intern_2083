import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Project } from "@/types/project.types";

export const projectsService = {
  async getAll(): Promise<Project[]> {
    const { data } = await apiClient.get<ApiResponse<Project[]>>("/v1/projects");
    if (!data.success) throw new Error(data.message ?? "Failed to load projects");
    return data.data;
  },
  async getFeatured(): Promise<Project[]> {
    const { data } = await apiClient.get<ApiResponse<Project[]>>("/v1/projects/featured");
    if (!data.success) throw new Error(data.message ?? "Failed to load featured projects");
    return data.data;
  },
  async getBySlug(slug: string): Promise<Project | null> {
    try {
      const { data } = await apiClient.get<ApiResponse<Project>>(`/v1/projects/${slug}`);
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },
};