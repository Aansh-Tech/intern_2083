import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Profile } from "@/types/profile.types";

/**
 * GET /v1/profile is confirmed live (ProfileController@show).
 *
 * UNCONFIRMED: ProfileController was only shown to us with a show()
 * method -- no update() has been confirmed yet. This assumes a standard
 * PUT /v1/profile route exists under auth:sanctum. If saving fails with
 * a 404 or 405, ask your backend friend to add:
 *   Route::put('/profile', [ProfileController::class, 'update']);
 * under the auth:sanctum group in routes/api.php, plus an update()
 * method on the controller itself.
 */
export const adminAboutService = {
  async getProfile(): Promise<Profile> {
    const { data } = await apiClient.get<ApiResponse<Profile>>("/v1/profile");
    if (!data.success) throw new Error(data.message ?? "Failed to load profile");
    return data.data;
  },

  async updateProfile(payload: Partial<Profile>): Promise<Profile> {
    const { data } = await apiClient.put<ApiResponse<Profile>>("/v1/profile", payload);
    if (!data.success) throw new Error(data.message ?? "Failed to update profile");
    return data.data;
  },
};