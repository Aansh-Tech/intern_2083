import api from "./api";
import type { ProfileData } from "../types/profile";
import { resolveImageUrl, uploadImage as sharedUploadImage } from "./image";

export async function getProfile(): Promise<ProfileData> {
  const response = await api.get("/v1/profile");
  const rawData = response.data.data ?? response.data;
  console.log("[profileService] RAW API response:", JSON.stringify(rawData, null, 2));

  const data: ProfileData = rawData;
  const rawPhoto = data.profile_photo;
  console.log("[profileService] Step 1 - Raw profile_photo from API:", rawPhoto);

  // Map backend's profile_photo → frontend's avatar
  // if (data.profile_photo && !data.avatar) {
  //   data.avatar = resolveImageUrl(data.profile_photo);
  // } else if (data.profile_photo && data.avatar) {
  //   console.log("[profileService] avatar already set, skipping mapping");
  // } else if (!data.profile_photo) {
  //   console.log("[profileService] Step 2 - FAIL: API returned no profile_photo");
  // }

  // Map avatar from images[] first, then fall back to profile_photo
const primaryAvatar =
  (data as any).images?.find((img: any) => img.is_primary)?.image?.url ??
  (data as any).images?.find((img: any) => img.type === "avatar")?.image?.url ??
  data.profile_photo ??
  null;

if (primaryAvatar) {
  data.avatar = resolveImageUrl(primaryAvatar);
  data.profile_image = data.avatar;
} else {
  console.log("[profileService] No avatar found in API response.");
}

  //console.log("[profileService] Step 3 - Resolved avatar URL:", data.avatar?.substring(0, 80));
  //console.log("[profileService] Step 4 - Final profile object passed to context:", JSON.stringify(data, null, 2));
  return data;
}

export async function updateProfile(
  data: Partial<ProfileData>,
  imageableType?: string,
  imageableId?: string | number
): Promise<ProfileData> {
  console.log("[profileService] updateProfile() called with keys:", Object.keys(data), "imageableType:", imageableType, "imageableId:", imageableId);

  // If avatar is a local URI and we have valid imageable params, upload first
  if (data.avatar && !data.avatar.startsWith("http") && imageableType && imageableId) {
    console.log("[profileService] avatar is local URI, uploading...");
    const uploaded = await sharedUploadImage(data.avatar, imageableType, imageableId, { type: "avatar" });
    console.log("[profileService] avatar uploaded to:", uploaded);
    data.avatar = uploaded;
  }

  // Map frontend's avatar → backend's profile_photo for the PUT request
  const putData: Record<string, unknown> = { ...data };
  if (putData.avatar) {
    putData.profile_photo = putData.avatar;
  }
  delete putData.avatar;
  delete putData.profile_image;

  console.log("[profileService] Calling PUT /v1/profile with profile_photo:", (putData.profile_photo as string)?.substring(0, 80));
  const response = await api.put("/v1/profile", putData);
  const result: ProfileData = response.data.data ?? response.data;

  // Map backend's profile_photo → frontend's avatar on the returned data
  // if (result.profile_photo && !result.avatar) {
  //   result.avatar = resolveImageUrl(result.profile_photo);
  // }

  const updatedAvatar =
  (result as any).images?.find((img: any) => img.is_primary)?.image?.url ??
  (result as any).images?.find((img: any) => img.type === "avatar")?.image?.url ??
  result.profile_photo ??
  null;

if (updatedAvatar) {
  result.avatar = resolveImageUrl(updatedAvatar);
  result.profile_image = result.avatar;
}

  //console.log("[profileService] PUT /v1/profile response status:", response.status);
  return result;
}
