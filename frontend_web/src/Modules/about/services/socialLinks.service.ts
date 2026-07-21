import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { SocialLink } from "@/types/socialLink.types";

export const socialLinksService = {
  async getAll(): Promise<SocialLink[]> {
    const { data } = await apiClient.get<ApiResponse<SocialLink[]>>(ENDPOINTS.socialLinks);
    if (!data.success) throw new Error(data.message ?? "Failed to load social links");
    return data.data;
  },
};