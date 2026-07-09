import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/services/apiResponse.types";
import type { Skill } from "@/types/skill.types";

export interface SkillPayload {
  name: string;
  display_order?: number;
  proficiency?: number; // renamed from `percentage`
  category?: string;
}

export const adminSkillsService = {
  async getAll(): Promise<Skill[]> {
    const { data } = await apiClient.get<ApiResponse<Skill[]>>(ENDPOINTS.skills);
    return data.data;
  },

  async create(payload: SkillPayload): Promise<Skill> {
    const { data } = await apiClient.post<ApiResponse<Skill>>(ENDPOINTS.skills, payload);
    return data.data;
  },

  async update(id: string, payload: SkillPayload): Promise<Skill> {
    const { data } = await apiClient.put<ApiResponse<Skill>>(
      `${ENDPOINTS.skills}/${id}`,
      payload
    );
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.skills}/${id}`);
  },
};