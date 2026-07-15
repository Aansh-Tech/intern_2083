import { apiClient } from "../../../../services/apiClient";
import type { ApiResponse } from "../../../../types/apiResponse.types";
import type { Comment } from "../../../../types/comment.types";

export const adminCommentsService = {
  async getAll(status?: Comment["status"]): Promise<Comment[]> {
    const { data } = await apiClient.get<ApiResponse<Comment[]>>(
      "/v1/comments",
      { params: status ? { status } : undefined }
    );
    if (!data.success) throw new Error(data.message ?? "Failed to load comments");
    return data.data;
  },

  async getByPostSlug(slug: string): Promise<Comment[]> {
    const { data } = await apiClient.get<ApiResponse<Comment[]>>(
      `/v1/blog-posts/${slug}/comments`
    );
    if (!data.success) throw new Error(data.message ?? "Failed to load comments");
    return data.data;
  },

  async updateStatus(id: number, status: Comment["status"]): Promise<Comment> {
    const { data } = await apiClient.patch<ApiResponse<Comment>>(
      `/v1/comments/${id}`,
      { status }
    );
    if (!data.success) throw new Error(data.message ?? "Failed to update comment");
    return data.data;
  },

  async remove(id: number): Promise<void> {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/v1/comments/${id}`
    );
    if (!data.success) throw new Error(data.message ?? "Failed to delete comment");
  },
};