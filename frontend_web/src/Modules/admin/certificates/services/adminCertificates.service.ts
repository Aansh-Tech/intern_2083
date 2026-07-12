import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Certificate } from "@/types/certificate.types";

export interface CertificatePayload {
  title: string;
  issuer: string;
  skill_id?: number;
  issue_date?: string;
  expiry_date?: string;
  credential_url?: string;
  image?: string;
  description?: string;
  display_order?: number;
}

export const adminCertificatesService = {
  async getAll(): Promise<Certificate[]> {
    const { data } = await apiClient.get<ApiResponse<Certificate[]>>(ENDPOINTS.certificates);
    return data.data;
  },
  async create(payload: CertificatePayload): Promise<Certificate> {
    const { data } = await apiClient.post<ApiResponse<Certificate>>(ENDPOINTS.certificates, payload);
    return data.data;
  },
  async update(id: number, payload: CertificatePayload): Promise<Certificate> {
    const { data } = await apiClient.put<ApiResponse<Certificate>>(`${ENDPOINTS.certificates}/${id}`, payload);
    return data.data;
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.certificates}/${id}`);
  },
};