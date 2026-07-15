import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse, PaginatedData } from "@/types/apiResponse.types";
import type { BlogPost } from "@/types/blogPost.types";

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<BlogPost>>>(
      ENDPOINTS.blogPosts
    );
    if (!data.success) throw new Error(data.message ?? "Failed to load posts");
    return data.data.data; // unwrap: ApiResponse.data → PaginatedData.data (the actual array)
  },

  async getLatestPosts(limit = 3): Promise<BlogPost[]> {
    const posts = await this.getAll();
    return posts.slice(0, limit);
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    const { data } = await apiClient.get<ApiResponse<BlogPost>>(
      `${ENDPOINTS.blogPosts}/${slug}`
    );
    return data.data;
  },
};