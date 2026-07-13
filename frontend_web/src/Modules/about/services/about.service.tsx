import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/services/apiResponse.types";
import type { Profile } from "@/types/profile.types";
import type { Skill } from "@/types/skill.types";
import type { SocialLink } from "@/types/socialLink.types";

export const aboutService = {
  async getProfile(): Promise<Profile> {
    const { data } = await apiClient.get<ApiResponse<Profile>>(ENDPOINTS.profile);
    return data.data;
  },

  async getSkills(): Promise<Skill[]> {
    const { data } = await apiClient.get<ApiResponse<Skill[]>>(ENDPOINTS.skills);
    return data.data;
  },

  async getSocialLinks(): Promise<SocialLink[]> {
    const { data } = await apiClient.get<ApiResponse<SocialLink[]>>(ENDPOINTS.socialLinks);
    return data.data;
  },
};