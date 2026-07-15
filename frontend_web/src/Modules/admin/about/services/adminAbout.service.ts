import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Profile } from "@/types/profile.types";

export const adminAboutService = {
  async getProfile(): Promise<Profile> {
    const { data } = await apiClient.get<ApiResponse<Profile>>("/v1/profile");
    if (!data.success) throw new Error(data.message ?? "Failed to load profile.");
    return data.data;
  },

  async updateProfile(payload: Partial<Profile>): Promise<Profile> {
    // Only send plain text fields — PUT /v1/profile is JSON-only, no files.
    const { title, bio, phone, address } = payload;
    const { data } = await apiClient.put<ApiResponse<Profile>>("/v1/profile", {
      title,
      bio,
      phone,
      address,
    });
    if (!data.success) throw new Error(data.message ?? "Failed to update profile");
    return data.data;
  },
};