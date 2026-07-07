import type { BlogPost } from "../../../types/blogPost.types";
import { mockBlogPosts } from "../mock/blog.mock";

/**
 * BlogPostController is currently EMPTY on the backend (no index/show
 * methods yet). Every function here returns mock data so the UI keeps
 * working. Once the backend adds:
 *   GET /blog-posts        -> index()
 *   GET /blog-posts/{slug} -> show($slug)
 * replace the body of each function below with:
 *
 *   import { apiClient } from "../../../services/apiClient";
 *   import type { ApiResponse } from "../../../services/apiResponse.types";
 *
 *   async getAll(): Promise<BlogPost[]> {
 *     const { data } = await apiClient.get<ApiResponse<BlogPost[]>>("/blog-posts");
 *     if (!data.success) throw new Error(data.message ?? "Failed to load posts");
 *     return data.data;
 *   }
 */
export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    return Promise.resolve(mockBlogPosts);
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    return Promise.resolve(
      mockBlogPosts.find((post) => post.slug === slug) ?? null
    );
  },
};