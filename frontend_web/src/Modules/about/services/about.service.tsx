import { apiClient } from "../../../services/apiClient";
import type { ApiResponse } from "../../../services/apiResponse.types";
import type { Profile } from "../../../types/profile.types";
import type { Skill } from "../../../types/skill.types";
import type { SocialLink } from "../../../types/socialLink.types";

/**
 * All three endpoints below are confirmed live:
 *   GET /profile       -> ProfileController@show (skills + social_links
 *                          already nested inside the response)
 *   GET /skills         -> SkillController@index (standalone, useful when
 *                          you only need skills, e.g. Home page toolkit)
 *   GET /social-links   -> SocialLinkController@index (standalone)
 */
export const aboutService = {
  async getProfile(): Promise<Profile> {
    const { data } = await apiClient.get<ApiResponse<Profile>>("/profile");

    if (!data.success) {
      throw new Error(data.message ?? "Failed to load profile");
    }

    return data.data;
  },

  async getSkills(): Promise<Skill[]> {
    const { data } = await apiClient.get<ApiResponse<Skill[]>>("/skills");

    if (!data.success) {
      throw new Error(data.message ?? "Failed to load skills");
    }

    return data.data;
  },

  async getSocialLinks(): Promise<SocialLink[]> {
    const { data } = await apiClient.get<ApiResponse<SocialLink[]>>(
      "/social-links"
    );

    if (!data.success) {
      throw new Error(data.message ?? "Failed to load social links");
    }

    return data.data;
  },
};