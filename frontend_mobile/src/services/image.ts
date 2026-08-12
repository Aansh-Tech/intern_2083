import api from "./api";

console.log = () => {};
console.info = () => {};
console.debug = () => {};

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
const SERVER_ROOT = API_BASE_URL.replace(/\/api$/i, "");

export function resolveImageUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Strip leading slashes and optional 'storage/' prefix to get clean relative path
  const cleanPath = path.replace(/^\/?(?:storage\/)?/, "");
  return `${SERVER_ROOT}/storage/${cleanPath}`;
}

export interface UploadImageOptions {
  type?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface UploadedProjectImage {
  id: string;
  url: string;
}

/**
 * Parses the upload response so every uploaded image gets its OWN
 * attachment/image reference (real backend id + resolved url). The id is the
 * imageables (attachment) row id when available, falling back to the images row id.
 */
export function parseUploadResult(result: any): { id: string; url: string } {
  const rawUrl = result?.path ?? result?.url ?? result?.image ?? "";
  const resolved = rawUrl ? resolveImageUrl(rawUrl) : "";
  const attId = result?.attachment?.id ?? result?.image?.id ?? result?.id ?? "";
  return { id: attId !== undefined && attId !== null ? String(attId) : "", url: resolved };
}

async function performUpload(
  uri: string,
  imageableType: string,
  imageableId: number | string,
  options?: UploadImageOptions
): Promise<{ id: string; url: string }> {
  console.log("[imageService] performUpload()", {
    uri: uri?.substring(0, 80),
    imageableType,
    imageableId,
    options,
  });

  const formData = new FormData();
  const filename = uri.split("/").pop() ?? "upload.jpg";
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  const mimeType = mimeTypes[ext] ?? "image/jpeg";

  const fileObj = { uri, name: filename, type: mimeType };
  formData.append("image", fileObj as any);
  formData.append("imageable_type", imageableType);
  formData.append("imageable_id", String(imageableId));

  if (options?.type) {
    formData.append("type", options.type);
  }

  // Laravel boolean validation: '1'/'0' strings pass, 'true'/'false' strings do NOT
  formData.append("is_primary", options?.isPrimary !== false ? "1" : "0");

  if (options?.displayOrder !== undefined) {
    formData.append("display_order", String(options.displayOrder));
  }

  const fullUrl = `${api.defaults.baseURL}/v1/images`;
  console.log("[imageService] POST", fullUrl);
  console.log("[imageService] FormData fields:", {
    image: { uri, name: filename, type: mimeType },
    imageable_type: imageableType,
    imageable_id: String(imageableId),
    type: options?.type ?? "(not set)",
    is_primary: options?.isPrimary !== false ? "1" : "0",
    display_order: options?.displayOrder ?? "(not set)",
  });

  try {
    const response = await api.post("/v1/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("[imageService] response status:", response.status);
    console.log("[imageService] response.data:", JSON.stringify(response.data).substring(0, 500));

    const result = response.data.data ?? response.data;
    const parsed = parseUploadResult(result);
    console.log("[imageService] extracted URL:", parsed.url);
    return parsed;
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.error("[imageService] upload failed:", {
      status,
      message: error?.message,
      validationErrors: data?.errors,
      responseData: JSON.stringify(data).substring(0, 500),
    });
    throw error;
  }
}

export async function uploadImage(
  uri: string,
  imageableType: string,
  imageableId: number | string,
  options?: UploadImageOptions
): Promise<string> {
  const uploaded = await performUpload(uri, imageableType, imageableId, options);
  return uploaded.url;
}

/**
 * Same upload as `uploadImage` but also returns the real backend id so the
 * caller can keep a stable image identity (used by the project multi-photo flow).
 */
export async function uploadProjectImage(
  uri: string,
  imageableType: string,
  imageableId: number | string,
  options?: UploadImageOptions
): Promise<UploadedProjectImage> {
  return await performUpload(uri, imageableType, imageableId, options);
}

type ImageIdentity = { id?: string | number | null; url?: string; uri?: string };

/**
 * Deduplicates images by real identity, in priority order:
 * 1. backend id, 2. resolved image url/path, 3. local uri.
 * Preserves the given order and stops once `max` items are collected.
 */
export function dedupeImages<T extends ImageIdentity>(
  images: T[] | undefined,
  max?: number
): T[] {
  if (!images || !Array.isArray(images)) return [];
  const seen = new Set<string>();
  const result: T[] = [];
  for (const img of images) {
    let key: string | null = null;
    if (img.id !== undefined && img.id !== null && img.id !== "") {
      key = `id:${img.id}`;
    } else if (img.url) {
      key = `url:${img.url}`;
    } else if (img.uri) {
      key = `uri:${img.uri}`;
    }
    if (key === null || seen.has(key)) continue;
    seen.add(key);
    result.push(img);
    if (max !== undefined && result.length >= max) break;
  }
  return result;
}

export async function deleteImage(attachmentId: number | string): Promise<void> {
  if (!attachmentId) return;
  try {
    await api.delete(`/v1/images/${attachmentId}`);
  } catch (error: any) {
    // 404 means the attachment is already gone server-side (stale list, a
    // retried save, or a duplicate attachment from an earlier buggy flow).
    // Treat it as success so a normal save never fails because an image was
    // already removed.
    if (error?.response?.status === 404) return;
    throw error;
  }
}
