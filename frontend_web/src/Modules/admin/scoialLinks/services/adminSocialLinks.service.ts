import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { SocialLink } from "@/types/socialLink.types";

export const adminSocialLinksService = {
  async getAll(): Promise<SocialLink[]> {
    const { data } = await apiClient.get<ApiResponse<SocialLink[]>>("/v1/social-links");
    if (!data.success) throw new Error(data.message ?? "Failed to load social links");
    return data.data;
  },
  async create(payload: Partial<SocialLink>): Promise<SocialLink> {
    const { data } = await apiClient.post<ApiResponse<SocialLink>>("/v1/social-links", payload);
    if (!data.success) throw new Error(data.message ?? "Failed to create social link");
    return data.data;
  },
  async update(id: number, payload: Partial<SocialLink>): Promise<SocialLink> {
    const { data } = await apiClient.put<ApiResponse<SocialLink>>(`/v1/social-links/${id}`, payload);
    if (!data.success) throw new Error(data.message ?? "Failed to update social link");
    return data.data;
  },
  async remove(id: number): Promise<void> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/v1/social-links/${id}`);
    if (!data.success) throw new Error(data.message ?? "Failed to delete social link");
  },
};