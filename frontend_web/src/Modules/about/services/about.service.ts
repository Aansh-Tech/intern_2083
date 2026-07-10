import { apiClient } from "../../../services/apiClient";
import type { ApiResponse } from "../../../services/apiResponse.types";
import type { Profile } from "../../../types/profile.types";
import type { Skill } from "../../../types/skill.types";
import type { SocialLink } from "../../../types/socialLink.types";

/**
 * All three endpoints are confirmed live, now under the /v1 prefix:
 *   GET /api/v1/profile       -> ProfileController@show
 *   GET /api/v1/skills        -> SkillController@index
 *   GET /api/v1/social-links  -> SocialLinkController@index
 */
export const aboutService = {
  async getProfile(): Promise<Profile> {
    const { data } = await apiClient.get<ApiResponse<Profile>>("/v1/profile");

    if (!data.success) {
      throw new Error(data.message ?? "Failed to load profile");
    }

    return data.data;
  },

  async getSkills(): Promise<Skill[]> {
    const { data } = await apiClient.get<ApiResponse<Skill[]>>("/v1/skills");

    if (!data.success) {
      throw new Error(data.message ?? "Failed to load skills");
    }

    return data.data;
  },

  async getSocialLinks(): Promise<SocialLink[]> {
    const { data } = await apiClient.get<ApiResponse<SocialLink[]>>(
      "/v1/social-links"
    );

    if (!data.success) {
      throw new Error(data.message ?? "Failed to load social links");
    }

    return data.data;
  },
};