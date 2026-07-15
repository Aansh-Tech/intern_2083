import { apiClient } from "@/services/apiClient";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Profile, ProfileImage } from "@/types/profile.types";

interface UploadImageParams {
  file: File;
  imageableType: string; // "profile" -- confirm exact string with backend if this fails
  imageableId: number;
  type: string; // "avatar"
  isPrimary?: boolean;
}

export async function uploadImage(params: UploadImageParams) {
  const formData = new FormData();
  formData.append("image", params.file);
  formData.append("imageable_type", params.imageableType);
  formData.append("imageable_id", String(params.imageableId));
  formData.append("type", params.type);
  if (params.isPrimary) formData.append("is_primary", "1");

  const { data } = await apiClient.post<ApiResponse<unknown>>("/v1/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success) throw new Error(data.message ?? "Image upload failed.");
  return data.data;
}

export async function deleteImage(imageId: number): Promise<void> {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/v1/images/${imageId}`);
  if (!data.success) throw new Error(data.message ?? "Failed to delete image.");
}

/**
 * Field name "resume" for the multipart upload is UNCONFIRMED with the
 * backend -- if this fails with a 422, ask what field name
 * POST /v1/profile/resume actually expects.
 */
export async function uploadResume(file: File): Promise<{ resume_path: string; resume_url: string }> {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await apiClient.post<ApiResponse<{ resume_path: string; resume_url: string }>>(
    "/v1/profile/resume",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  if (!data.success) throw new Error(data.message ?? "Resume upload failed.");
  return data.data;
}

export function getPrimaryAvatar(images?: ProfileImage[]): ProfileImage | undefined {
  if (!images) return undefined;
  return images.find((img) => img.type === "avatar" && img.is_primary) ?? images.find((img) => img.type === "avatar");
}