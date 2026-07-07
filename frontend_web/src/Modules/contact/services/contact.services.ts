/**
 * ContactController is currently EMPTY on the backend. Mocked for now.
 * Once the backend adds:
 *   POST /contact-messages -> store(request)
 * replace the body below with:
 *
 *   import { apiClient } from "../../../services/apiClient";
 *   import type { ApiResponse } from "../../../services/apiResponse.types";
 *
 *   async send(payload: ContactPayload): Promise<void> {
 *     const { data } = await apiClient.post<ApiResponse<null>>(
 *       "/contact-messages",
 *       payload
 *     );
 *     if (!data.success) throw new Error(data.message ?? "Failed to send message");
 *   }
 */
export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const contactService = {
  async send(_payload: ContactPayload): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return Promise.resolve();
  },
};