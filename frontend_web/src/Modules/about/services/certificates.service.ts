import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Certificate } from "@/types/certificate.types";

export const certificatesService = {
  async getAll(): Promise<Certificate[]> {
    const { data } = await apiClient.get<ApiResponse<Certificate[]>>(ENDPOINTS.certificates);
    if (!data.success) throw new Error(data.message ?? "Failed to load certificates");
    return data.data;
  },
};