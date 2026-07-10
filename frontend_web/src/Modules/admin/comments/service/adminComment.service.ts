import { apiClient } from "../../../../services/apiClient";
import type { ApiResponse } from "../../../../types/apiResponse.types";
import type { Comment } from "../../../../types/comment.types";

/**
 * KNOWN GAP: comments are fetched per-post by SLUG (not a global "all
 * comments" list), and there is no approve/update endpoint -- only
 * delete. A comment can only ever be removed, never marked approved,
 * unless the backend adds a PATCH/PUT route for that.
 */
export const adminCommentsService = {
  async getByPostSlug(slug: string): Promise<Comment[]> {
    const { data } = await apiClient.get<ApiResponse<Comment[]>>(
      `/v1/blog-posts/${slug}/comments`
    );
    if (!data.success) throw new Error(data.message ?? "Failed to load comments");
    return data.data;
  },

  async remove(id: number): Promise<void> {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/v1/comments/${id}`
    );
    if (!data.success) throw new Error(data.message ?? "Failed to delete comment");
  },
};