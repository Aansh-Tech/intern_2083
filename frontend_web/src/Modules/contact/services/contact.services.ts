import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/services/apiResponse.types";
import type { ContactMessagePayload, ContactMessage } from "@/types/contactMessage.types";

export const contactService = {
  async submit(payload: ContactMessagePayload): Promise<ContactMessage> {
    const { data } = await apiClient.post<ApiResponse<ContactMessage>>(
      ENDPOINTS.contactMessages,
      payload
    );
    return data.data;
  },
};