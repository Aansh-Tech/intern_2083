import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Profile } from "@/types/profile.types";
import type { Skill } from "@/types/skill.types";

export const aboutService = {
  async getProfile(): Promise<Profile> {
    const { data } = await apiClient.get<ApiResponse<Profile>>("/v1/profile");
    if (!data.success) throw new Error(data.message ?? "Failed to load profile.");
    return data.data;
  },

  async getSkills(): Promise<Skill[]> {
    const { data } = await apiClient.get<ApiResponse<Skill[]>>("/v1/skills");
    if (!data.success) throw new Error(data.message ?? "Failed to load skills.");
    return data.data;
  },
};