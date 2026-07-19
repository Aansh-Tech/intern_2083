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
}

export async function uploadImage(
  uri: string,
  imageableType: string,
  imageableId: number | string,
  options?: UploadImageOptions
): Promise<string> {
  console.log("[imageService] uploadImage()", {
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

  const fullUrl = `${api.defaults.baseURL}/v1/images`;
  console.log("[imageService] POST", fullUrl);
  console.log("[imageService] FormData fields:", {
    image: { uri, name: filename, type: mimeType },
    imageable_type: imageableType,
    imageable_id: String(imageableId),
    type: options?.type ?? "(not set)",
    is_primary: options?.isPrimary !== false ? "1" : "0",
  });

  try {
    const response = await api.post("/v1/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("[imageService] response status:", response.status);
    console.log("[imageService] response.data:", JSON.stringify(response.data).substring(0, 500));

    const result = response.data.data ?? response.data;
    const rawUrl = result.path ?? result.url ?? result.image ?? "";
    const resolved = rawUrl ? resolveImageUrl(rawUrl) : "";
    console.log("[imageService] extracted URL:", resolved);
    return resolved;
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
