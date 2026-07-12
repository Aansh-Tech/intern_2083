import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Skill } from "@/types/skill.types";

export const adminSkillsService = {
  async getAll(): Promise<Skill[]> {
    const { data } = await apiClient.get<ApiResponse<Skill[]>>("/v1/skills");
    if (!data.success) throw new Error(data.message ?? "Failed to load skills");
    return data.data;
  },
  async create(payload: Partial<Skill>): Promise<Skill> {
    const { data } = await apiClient.post<ApiResponse<Skill>>("/v1/skills", payload);
    if (!data.success) throw new Error(data.message ?? "Failed to create skill");
    return data.data;
  },
  async update(id: number, payload: Partial<Skill>): Promise<Skill> {
    const { data } = await apiClient.put<ApiResponse<Skill>>(`/v1/skills/${id}`, payload);
    if (!data.success) throw new Error(data.message ?? "Failed to update skill");
    return data.data;
  },
  async remove(id: number): Promise<void> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/v1/skills/${id}`);
    if (!data.success) throw new Error(data.message ?? "Failed to delete skill");
  },
};