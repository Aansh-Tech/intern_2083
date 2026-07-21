import api from "./api";
import { resolveImageUrl } from "./image";

console.log = () => {};
console.info = () => {};
console.debug = () => {};

export interface BackendImageItem {
  id?: number;
  image_path?: string;
  url?: string;
  filename?: string;
}

export interface BackendImageAttachment {
  id?: number;
  is_primary?: boolean;
  type?: string;
  display_order?: number;
  image?: BackendImageItem;
}

export interface BackendCertificate {
  id: number;
  title: string;
  issuer?: string;
  category?: string;
  description?: string;
  issue_date?: string;
  image?: string | null;
  images?: BackendImageAttachment[];
  url?: string;
  created_at?: string;
}

function mapCertificate(item: BackendCertificate) {
  console.log("[certificateService] Step 1 - Raw item:", JSON.stringify(item, null, 2));

  let imageUrl: string | null = null;

  if (item.images && item.images.length > 0) {
    console.log("[certificateService] Step 2a - Found images[] array, length:", item.images.length);
    const primary = item.images.find((img) => img.is_primary) ?? item.images[0];
    console.log("[certificateService] Step 2b - Primary image attachment:", JSON.stringify(primary, null, 2));

    if (!primary?.image) {
      console.log("[certificateService] Step 2c - FAIL: primary.image is null/undefined (eager loading missing?)");
    } else {
      const imgSrc = primary.image.url ?? primary.image.image_path ?? null;
      console.log("[certificateService] Step 2d - Extracted imgSrc:", imgSrc);

      if (!imgSrc) {
        console.log("[certificateService] Step 2e - FAIL: primary.image.url AND primary.image.image_path both missing");
      } else {
        imageUrl = resolveImageUrl(imgSrc);
        console.log("[certificateService] Step 2f - Resolved URL:", imageUrl);
      }
    }
  } else if (item.image) {
    console.log("[certificateService] Step 3a - Using fallback image field:", item.image);
    imageUrl = resolveImageUrl(item.image);
    console.log("[certificateService] Step 3b - Resolved URL:", imageUrl);
  } else {
    console.log("[certificateService] Step 4 - FAIL: No images[] array and no image field for cert ID:", item.id);
  }

  const result = {
    id: String(item.id),
    title: item.title,
    issuer: item.issuer ?? "",
    category: item.category ?? "",
    description: item.description ?? "",
    issueDate: item.issue_date ?? "",
    image: imageUrl,
    url: item.url ?? "",
    createdAt: item.created_at ?? "",
  };
  console.log("[certificateService] Step 5 - Final mapped object:", JSON.stringify(result, null, 2));
  return result;
}

export async function getCertificates() {
  const response = await api.get("/v1/certificates");
  const raw = response.data;
  console.log("[certificateService] RAW API response:", JSON.stringify(raw, null, 2));

  const items: BackendCertificate[] = raw.data ?? raw ?? [];

  console.log("[certificateService] Certificates count:", items.length);
  if (items.length > 0) {
    console.log("[certificateService] First item images:",
      JSON.stringify(items[0].images ?? "(no images field)", null, 2));
    console.log("[certificateService] First item image (fallback):",
      items[0].image ?? "(null)");
  } else {
    console.log("[certificateService] FAIL: API returned no certificates");
  }

  return items.map(mapCertificate);
}

export async function getCertificate(id: string) {
  const response = await api.get(`/v1/certificates/${id}`);

  console.log(
    "[certificateService] Single certificate:",
    JSON.stringify(response.data, null, 2)
  );

  const item: BackendCertificate =
    response.data.data ?? response.data;

  return mapCertificate(item);
}

export async function createCertificate(data: {
  title: string;
  issuer?: string;
  category?: string;
  description?: string;
  issue_date?: string;
  image?: string;
}) {
  const response = await api.post("/v1/certificates", data);

  const item: BackendCertificate =
    response.data.data ?? response.data;

  return mapCertificate(item);
}

export async function updateCertificate(
  id: string,
  data: {
    title?: string;
    issuer?: string;
    category?: string;
    description?: string;
    issue_date?: string;
    image?: string;
  }
) {
  const response = await api.put(`/v1/certificates/${id}`, data);

  const item: BackendCertificate =
    response.data.data ?? response.data;

  return mapCertificate(item);
}

export async function deleteCertificate(id: string) {
  await api.delete(`/v1/certificates/${id}`);
}

