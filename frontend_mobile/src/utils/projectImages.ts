import type { ProjectImage } from "../types/project";
import { MAX_PROJECT_PHOTOS } from "../types/project";
import { resolveImageUrl, dedupeImages } from "../services/image";

export interface NormalizedProjectImage extends ProjectImage {
  key: string;
}

interface ProjectImageSource {
  image?: string | null;
  images?: Array<{ id?: string | number | null; url?: string; displayOrder?: number } | null> | null;
}

/**
 * Normalizes a project's image data at the UI boundary before rendering.
 *
 * - resolves relative URLs with the shared image URL helper (idempotent)
 * - drops null / empty entries
 * - falls back to the single `image` field when the `images` array is empty
 * - deduplicates by real identity (backend id, then resolved url)
 * - preserves backend `display_order` when present, otherwise given order
 * - caps at MAX_PROJECT_PHOTOS (5)
 * - attaches a stable `key` (preferring image id) so lists never collide
 *
 * Never mutates the original project/response.
 */
export function normalizeProjectImages(
  project?: ProjectImageSource | null
): NormalizedProjectImage[] {
  if (!project) return [];

  const raw: ProjectImage[] = [];
  if (Array.isArray(project.images)) {
    for (const img of project.images) {
      if (!img || typeof img !== "object") continue;
      raw.push({
        id: img.id !== undefined && img.id !== null ? String(img.id) : "",
        url: typeof img.url === "string" ? img.url : "",
        displayOrder: img.displayOrder,
      });
    }
  }

  const resolved = raw
    .map((img) => {
      const url = resolveImageUrl(img.url);
      return { ...img, url };
    })
    .filter((img) => typeof img.url === "string" && img.url.trim().length > 0);

  if (project.image) {
    const singleUrl = resolveImageUrl(project.image);
    if (singleUrl) {
      resolved.push({ id: project.image, url: singleUrl });
    }
  }

  const deduped = dedupeImages(resolved, MAX_PROJECT_PHOTOS);

  const withOrder = deduped.map((img, index) => ({
    ...img,
    displayOrder: img.displayOrder ?? index,
  }));
  withOrder.sort((a, b) => a.displayOrder - b.displayOrder);

  return withOrder.map((img) => {
    const id = img.id !== undefined && img.id !== null ? String(img.id) : "";
    const key = id.trim() ? id : img.url;
    return { ...img, key };
  });
}

/** First normalized image, used as the card/hero cover. */
export function primaryProjectImage(
  project?: ProjectImageSource | null
): string | undefined {
  return normalizeProjectImages(project)[0]?.url;
}