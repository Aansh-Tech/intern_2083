import { apiClient } from "../../../../services/apiClient";
import type { ApiResponse, PaginatedData } from "../../../../types/apiResponse.types";
import type { BlogPost } from "../../../../types/blogPost.types";

/**
 * KNOWN GAP: there is no admin "list all posts" endpoint. The only index()
 * available (GET /v1/blog-posts) filters where('status', 'published') --
 * so drafts and archived posts are invisible to any list call. Ask the
 * backend to add an admin-only index (e.g. under the auth:sanctum group)
 * that returns all statuses. Until then, this list only shows published
 * posts, and newly created drafts won't appear here after saving.
 */
export const adminBlogPostsService = {
  async getAll(): Promise<BlogPost[]> {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<BlogPost>>>(
      "/v1/blog-posts"
    );
    if (!data.success) throw new Error(data.message ?? "Failed to load posts");
    return data.data.data;
  },

  async create(payload: Partial<BlogPost>): Promise<BlogPost> {
    const { data } = await apiClient.post<ApiResponse<BlogPost>>(
      "/v1/blog-posts",
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