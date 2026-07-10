import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Project } from "@/types/project.types";

export interface ProjectPayload {
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  content?: string;
  github_link?: string;
  live_link?: string;
  technologies?: string;
  is_featured?: boolean;
  status?: "draft" | "published" | "archived";
  completed_at?: string;
}

export const adminProjectsService = {
  async getAll(): Promise<Project[]> {
    const { data } = await apiClient.get<ApiResponse<Project[]>>(ENDPOINTS.projects);
    return data.data;
  },
  async create(payload: ProjectPayload): Promise<Project> {
    const { data } = await apiClient.post<ApiResponse<Project>>(ENDPOINTS.projects, payload);
    return data.data;
  },
  async update(id: number, payload: ProjectPayload): Promise<Project> {
    const { data } = await apiClient.put<ApiResponse<Project>>(`${ENDPOINTS.projects}/${id}`, payload);
    return data.data;
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.projects}/${id}`);
  },
};