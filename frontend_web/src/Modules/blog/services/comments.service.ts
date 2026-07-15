import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/apiResponse.types";
import type { Comment, CommentPayload } from "@/types/comment.types";

export const commentsService = {
  async getByPostSlug(slug: string): Promise<Comment[]> {
    const { data } = await apiClient.get<ApiResponse<Comment[]>>(
      `${ENDPOINTS.blogPosts}/${slug}/comments`
    );
    return data.data;
  },

  async submit(payload: CommentPayload): Promise<Comment> {
    const { data } = await apiClient.post<ApiResponse<Comment>>(
      ENDPOINTS.comments,
      payload
    );
    return data.data;
  },
};