import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/services/apiResponse.types";
import type { SocialLink } from "@/types/socialLink.types";

export interface SocialLinkPayload {
  platform: string;
  url: string;
  display_order: number;
}

export const adminSocialLinksService = {
  async getAll(): Promise<SocialLink[]> {
    const { data } = await apiClient.get<ApiResponse<SocialLink[]>>(ENDPOINTS.socialLinks);
    return data.data;
  },

  async create(payload: SocialLinkPayload): Promise<SocialLink> {
    const { data } = await apiClient.post<ApiResponse<SocialLink>>(
      ENDPOINTS.socialLinks,
      payload
    );
    return data.data;
  },

  async update(id: number, payload: SocialLinkPayload): Promise<SocialLink> {
    const { data } = await apiClient.put<ApiResponse<SocialLink>>(
      `${ENDPOINTS.socialLinks}/${id}`,
      payload
    );
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.socialLinks}/${id}`);
  },
};