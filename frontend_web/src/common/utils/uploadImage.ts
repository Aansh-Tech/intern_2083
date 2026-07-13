import { apiClient } from "@/services/apiClient";
import type { ProfileImage } from "@/types/profile.types";

export type ImageableType = "profile" | "skill" | "project" | "certificate" | "blog_post";

export interface UploadImagePayload {
  file: File;
  imageableType: ImageableType;
  imageableId: number;
  type?: string;
  isPrimary?: boolean;
  displayOrder?: number;
  altText?: string;
  caption?: string;
}

interface UploadImageResponse {
  success: boolean;
  message: string;
  data: {
    image: {
      id: number;
      image_path: string;
      filename: string;
      alt_text: string | null;
      caption: string | null;
      type: string;
      size: number;
      mime_type: string;
    };
    attachment: {
      id: number;
      image_id: number;
      imageable_type: string;
      imageable_id: number;
      type: string;
      display_order: number;
      is_primary: boolean;
    };
    url: string;
  };
}

/** Uploads an image and attaches it to a model in one request. jpg/jpeg/png/webp only, max 5MB. */
export async function uploadImage(payload: UploadImagePayload): Promise<UploadImageResponse["data"]> {
  const formData = new FormData();
  formData.append("image", payload.file);
  formData.append("imageable_type", payload.imageableType);
  formData.append("imageable_id", String(payload.imageableId));
  if (payload.type) formData.append("type", payload.type);
  if (payload.isPrimary !== undefined) formData.append("is_primary", payload.isPrimary ? "1" : "0");
  if (payload.displayOrder !== undefined) formData.append("display_order", String(payload.displayOrder));
  if (payload.altText) formData.append("alt_text", payload.altText);
  if (payload.caption) formData.append("caption", payload.caption);

  const { data } = await apiClient.post<UploadImageResponse>("/v1/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success) throw new Error(data.message ?? "Image upload failed.");
  return data.data;
}

/** attachmentId is the imageables row id, not the images row id. */
export async function deleteImageAttachment(attachmentId: number): Promise<void> {
  const { data } = await apiClient.delete<{ success: boolean; message: string }>(`/v1/images/${attachmentId}`);
  if (!data.success) throw new Error(data.message ?? "Failed to remove image.");
}

/** Picks the current avatar (type: "avatar", is_primary: true) out of a Profile's images array. */
export function getPrimaryAvatar(images: ProfileImage[] | undefined): ProfileImage | undefined {
  return images?.find((img) => img.type === "avatar" && img.is_primary);
}

interface UploadResumeResponse {
  success: boolean;
  message: string;
  data: {
    resume_path: string;
    resume_url: string;
  };
}

/** POST /v1/profile/resume — multipart, PDF only. Separate from the images system. */
export async function uploadResume(file: File): Promise<UploadResumeResponse["data"]> {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await apiClient.post<UploadResumeResponse>("/v1/profile/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success) throw new Error(data.message ?? "Resume upload failed.");
  return data.data;
}