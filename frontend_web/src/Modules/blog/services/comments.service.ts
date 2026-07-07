import type { Comment } from "../../../types/comment.types";
import { mockComments } from "../mock/blog.mock";

/**
 * CommentController is currently EMPTY on the backend. Mocked for now.
 * Once the backend adds:
 *   GET  /blog-posts/{id}/comments -> index($blogPostId)
 *   POST /blog-posts/{id}/comments -> store($blogPostId, request)
 * replace the bodies below with:
 *
 *   import { apiClient } from "../../../services/apiClient";
 *   import type { ApiResponse } from "../../../services/apiResponse.types";
 *
 *   async getByPost(blogPostId: string): Promise<Comment[]> {
 *     const { data } = await apiClient.get<ApiResponse<Comment[]>>(
 *       `/blog-posts/${blogPostId}/comments`
 *     );
 *     if (!data.success) throw new Error(data.message ?? "Failed to load comments");
 *     return data.data;
 *   }
 *
 *   async create(blogPostId: string, payload: { name: string; email: string; content: string }): Promise<Comment> {
 *     const { data } = await apiClient.post<ApiResponse<Comment>>(
 *       `/blog-posts/${blogPostId}/comments`,
 *       payload
 *     );
 *     if (!data.success) throw new Error(data.message ?? "Failed to post comment");
 *     return data.data;
 *   }
 */
export const commentsService = {
  async getByPost(blogPostId: string): Promise<Comment[]> {
    return Promise.resolve(
      mockComments.filter((comment) => comment.blogPostId === blogPostId)
    );
  },

  async create(
    blogPostId: string,
    payload: { name: string; email: string; content: string }
  ): Promise<Comment> {
    const comment: Comment = {
      id: crypto.randomUUID(),
      blogPostId,
      name: payload.name,
      content: payload.content,
      createdAt: new Date().toISOString(),
    };
    return Promise.resolve(comment);
  },
};