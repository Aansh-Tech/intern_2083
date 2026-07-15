import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Skill } from "@/types/skill.types";

export const skillsService = {
  async getAll(): Promise<Skill[]> {
    const { data } = await apiClient.get<ApiResponse<Skill[]>>("/v1/skills");
    if (!data.success) throw new Error(data.message ?? "Failed to load skills");
    return data.data;
  },
};