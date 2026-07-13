import { apiClient } from "../../../../services/apiClient";
import type { ApiResponse } from "../../../../types/apiResponse.types";
import type { ContactMessage } from "../../../../types/contactMessage.types";

export const adminContactMessagesService = {
  async getAll(): Promise<ContactMessage[]> {
    const { data } = await apiClient.get<ApiResponse<ContactMessage[]>>(
      "/v1/contact"
    );
    if (!data.success) throw new Error(data.message ?? "Failed to load messages");
    return data.data;
  },

  async remove(id: number): Promise<void> {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/v1/contact/${id}`
    );
    if (!data.success) throw new Error(data.message ?? "Failed to delete message");
  },

  async markAsRead(id: number): Promise<ContactMessage> {
    const { data } = await apiClient.patch<ApiResponse<ContactMessage>>(
      `/v1/contact/${id}/read`
    );
    if (!data.success) throw new Error(data.message ?? "Failed to mark as read");
    return data.data;
  },
};