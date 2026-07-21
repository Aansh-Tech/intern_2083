import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/services/apiResponse.types";
import type { BlogPost } from "@/types/blogPost.types";

export const blogService = {
  // NOT LIVE YET — BlogPostController has no methods implemented.
  // Calling the real endpoint anyway so this works the moment backend adds it.
  async getAll(): Promise<BlogPost[]> {
    const { data } = await apiClient.get<ApiResponse<BlogPost[]>>(ENDPOINTS.blogPosts);
    return data.data;
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