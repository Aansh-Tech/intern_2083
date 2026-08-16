import api from "./api";
import { resolveImageUrl } from "./image";


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
  let imageUrl: string | null = null;

  if (item.images && item.images.length > 0) {
    const primary = item.images.find((img) => img.is_primary) ?? item.images[0];

    if (primary?.image) {
      const imgSrc = primary.image.url ?? primary.image.image_path ?? null;

      if (imgSrc) {
        imageUrl = resolveImageUrl(imgSrc);
      }
    }
  } else if (item.image) {
    imageUrl = resolveImageUrl(item.image);
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
  return result;
}

export async function getCertificates() {
  const response = await api.get("/v1/certificates");
  const raw = response.data;

  const items: BackendCertificate[] = raw.data ?? raw ?? [];

  return items.map(mapCertificate);
}

export async function getCertificate(id: string) {
  const response = await api.get(`/v1/certificates/${id}`);

  const item: BackendCertificate =
    response.data.data ?? response.data;

  return mapCertificate(item);
}

type CertificatePayload = {
  title?: string;
  issuer?: string;
  category?: string;
  description?: string;
  issue_date?: string;
  image?: string;
};

/**
 * Maps the mobile form shape ({ title, issuer, category, description,
 * issueDate, image }) onto the fields the Laravel CertificateController
 * validates for create + update. Empty optional strings are sent as `null` so
 * the backend's `nullable|date` / `nullable|string` rules never reject them
 * (empty string would otherwise fail validation). `issuer` and `title` are
 * required server-side, so they are passed through as-is.
 */
export function buildCertificatePayload(data: CertificatePayload) {
  return {
    title: data.title ?? "",
    issuer: data.issuer ?? "",
    category: data.category ?? "",
    description: data.description?.trim() ? data.description.trim() : null,
    issue_date: data.issue_date?.trim() ? data.issue_date.trim() : null,
    image: data.image?.trim() ? data.image.trim() : null,
  };
}

export async function createCertificate(data: CertificatePayload) {
  const response = await api.post("/v1/certificates", buildCertificatePayload(data));

  const item: BackendCertificate =
    response.data.data ?? response.data;

  return mapCertificate(item);
}

export async function updateCertificate(id: string, data: CertificatePayload) {
  const response = await api.put(
    `/v1/certificates/${id}`,
    buildCertificatePayload(data)
  );

  const item: BackendCertificate =
    response.data.data ?? response.data;

  return mapCertificate(item);
}

export async function deleteCertificate(id: string) {
  await api.delete(`/v1/certificates/${id}`);
}

