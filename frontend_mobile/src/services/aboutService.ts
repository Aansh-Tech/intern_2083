import api from "./api";
import type { ProfileData } from "../types/profile";
import type { SocialLink } from "../types/socialLink";
import { resolveImageUrl } from "./image";

function normalizeProfile(raw: any): ProfileData {
  const data: ProfileData = { ...raw };

  const primaryAvatar =
    (raw as any).images?.find((img: any) => img.is_primary)?.image?.url ??
    (raw as any).images?.find((img: any) => img.type === "avatar")?.image?.url ??
    raw.profile_photo ??
    raw.avatar ??
    raw.profile_image ??
    null;
  if (primaryAvatar) {
    const resolved = resolveImageUrl(primaryAvatar);
    data.avatar = resolved;
    data.profile_image = resolved;
    data.profile_photo = resolved;
  }

  if (!data.resume_url) {
    const fallback = raw.resume ?? raw.resume_path;
    if (fallback) {
      data.resume_url = resolveImageUrl(fallback);
    }
  } else if (data.resume_url) {
    data.resume_url = resolveImageUrl(data.resume_url);
  }

  return data;
}

export async function getAbout(): Promise<ProfileData> {
  const response = await api.get("/v1/profile");
  const raw = response.data.data ?? response.data;
  return normalizeProfile(raw);
}

export async function updateProfile(payload: {
  title?: string;
  bio?: string;
  phone?: string;
  address?: string;
  profile_photo?: string;
}): Promise<void> {
  const body: Record<string, unknown> = {};
  if (payload.title !== undefined) body.title = payload.title;
  if (payload.bio !== undefined) body.bio = payload.bio;
  if (payload.phone !== undefined) body.phone = payload.phone;
  if (payload.address !== undefined) body.address = payload.address;
  if (payload.profile_photo !== undefined) body.profile_photo = payload.profile_photo;

  await api.put("/v1/profile", body);
}

export async function uploadResume(fileUri: string): Promise<void> {
  const fd = new FormData();
  const filename = fileUri.split("/").pop() ?? "resume.pdf";
  fd.append("resume", { uri: fileUri, name: filename, type: "application/pdf" } as any);

  await api.post("/v1/profile/resume", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const response = await api.get("/v1/social-links");
  const raw = response.data.data ?? response.data;
  return Array.isArray(raw) ? raw : [];
}

export async function createSocialLink(data: {
  platform: string;
  url: string;
  icon?: string;
  display_order?: number;
}): Promise<SocialLink> {
  const response = await api.post("/v1/social-links", data);
  return response.data.data ?? response.data;
}

export async function updateSocialLink(
  id: number,
  data: { platform?: string; url?: string; icon?: string; display_order?: number }
): Promise<SocialLink> {
  const response = await api.put(`/v1/social-links/${id}`, data);
  return response.data.data ?? response.data;
}

export async function deleteSocialLink(id: number): Promise<void> {
  await api.delete(`/v1/social-links/${id}`);
}

export type SocialLinkInput = { id?: number; platform: string; url: string };

export async function saveAbout(payload: {
  title?: string;
  bio?: string;
  phone?: string;
  address?: string;
  profile_photo?: string;
  resumeUri?: string | null;
  socialLinks?: SocialLinkInput[];
  previousSocialLinks?: SocialLinkInput[];
}): Promise<void> {
  await updateProfile({
    title: payload.title,
    bio: payload.bio,
    phone: payload.phone,
    address: payload.address,
    profile_photo: payload.profile_photo,
  });

  if (payload.resumeUri) {
    await uploadResume(payload.resumeUri);
  }

  const before = payload.previousSocialLinks ?? [];
  const after = payload.socialLinks ?? [];

  const beforeMap = new Map<number, SocialLinkInput>();
  for (const link of before) {
    if (link.id != null) beforeMap.set(link.id, link);
  }

  const afterIds = new Set<number>();
  for (const link of after) {
    if (link.id != null) {
      afterIds.add(link.id);
      const original = beforeMap.get(link.id);
      if (original && (original.platform !== link.platform || original.url !== link.url)) {
        await updateSocialLink(link.id, { platform: link.platform, url: link.url });
      }
    } else {
      await createSocialLink({ platform: link.platform, url: link.url });
    }
  }

  for (const [id] of beforeMap) {
    if (!afterIds.has(id)) {
      await deleteSocialLink(id);
    }
  }
}
