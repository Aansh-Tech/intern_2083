import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/services/apiResponse.types";
import type { Comment, CommentPayload } from "@/types/comment.types";

export const commentsService = {
  // NOT LIVE YET — CommentController has no methods implemented.
  async getByPostSlug(slug: string): Promise<Comment[]> {
    const { data } = await apiClient.get<ApiResponse<Comment[]>>(
      `${ENDPOINTS.blogPosts}/${slug}/comments`
    );
    return data.data;
  },

  async submit(slug: string, payload: CommentPayload): Promise<Comment> {
    const { data } = await apiClient.post<ApiResponse<Comment>>(
      `${ENDPOINTS.blogPosts}/${slug}/comments`,
      payload
    );
    return data.data;
  },
};