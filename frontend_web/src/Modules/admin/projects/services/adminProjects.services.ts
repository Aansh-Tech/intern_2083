import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Project } from "@/types/project.types";

export const adminProjectsService = {
  async getAll(): Promise<Project[]> {
    const { data } = await apiClient.get<ApiResponse<Project[]>>("/v1/projects");
    if (!data.success) throw new Error(data.message ?? "Failed to load projects");
    return data.data;
  },
  async create(payload: Partial<Project>): Promise<Project> {
    const { data } = await apiClient.post<ApiResponse<Project>>("/v1/projects", payload);
    if (!data.success) throw new Error(data.message ?? "Failed to create project");
    return data.data;
  },
  async update(id: number, payload: Partial<Project>): Promise<Project> {
    const { data } = await apiClient.put<ApiResponse<Project>>(`/v1/projects/${id}`, payload);
    if (!data.success) throw new Error(data.message ?? "Failed to update project");
    return data.data;
  },
  async remove(id: number): Promise<void> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/v1/projects/${id}`);
    if (!data.success) throw new Error(data.message ?? "Failed to delete project");
  },
};