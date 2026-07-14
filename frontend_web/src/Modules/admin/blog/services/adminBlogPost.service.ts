import { apiClient } from "../../../../services/apiClient";
import type { ApiResponse, PaginatedData } from "../../../../types/apiResponse.types";
import type { BlogPost } from "../../../../types/blogPost.types";

export const adminBlogPostsService = {
  async getAll(): Promise<BlogPost[]> {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<BlogPost>>>(
      "/v1/admin/blog-posts"
    );
    if (!data.success) throw new Error(data.message ?? "Failed to load posts");
    return data.data.data;
  },

  async create(payload: Partial<BlogPost>): Promise<BlogPost> {
    const { data } = await apiClient.post<ApiResponse<BlogPost>>(
      "/v1/admin/blog-posts",
      payload
    );
    if (!data.success) throw new Error(data.message ?? "Failed to create post");
    return data.data;
  },

  async update(id: number, payload: Partial<BlogPost>): Promise<BlogPost> {
    const { data } = await apiClient.put<ApiResponse<BlogPost>>(
      `/v1/blog-posts/${id}`,
      payload
    );
    if (!data.success) throw new Error(data.message ?? "Failed to update post");
    return data.data;
  },

  async remove(id: number): Promise<void> {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/v1/blog-posts/${id}`
    );
    if (!data.success) throw new Error(data.message ?? "Failed to delete post");
  },
};