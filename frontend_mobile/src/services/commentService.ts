// src/services/commentService.ts
import api from "./api";
import type { Comment } from "../types/comment";

export const getAllComments = async (): Promise<Comment[]> => {
  try {
    const response = await api.get("/v1/comments");
    let data = response.data?.data || response.data;
    if (!Array.isArray(data)) data = [];
    return data.map((c: any) => ({
      id: String(c.id),
      name: c.name || "Anonymous",
      email: c.email || "",
      comment: c.content || c.comment || "",
      status: c.status === "rejected" ? "spam" : (c.status || "pending"),
      createdAt: c.created_at || c.createdAt || new Date().toISOString(),
      blogTitle: c.blog_post?.title || "Unknown Post",
      blogSlug: c.blog_post?.slug || "",
      blogId: c.blog_post?.id ? String(c.blog_post.id) : "",
    }));
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – token missing or invalid. Returning empty comments.");
      return [];
    }
    console.warn("Global comments endpoint failed, using fallback.");
    return getAllCommentsFallback();
  }
};

// Fallback – also handles 401
const getAllCommentsFallback = async (): Promise<Comment[]> => {
  try {
    const postsResponse = await api.get("/v1/blog-posts");
    let postsData = postsResponse.data?.data?.data || postsResponse.data?.data || postsResponse.data;
    if (!Array.isArray(postsData)) postsData = [];

    const allComments: Comment[] = [];
    for (const post of postsData) {
      try {
        const res = await api.get(`/v1/blog-posts/${post.slug}/comments`);
        let comments = res.data?.data || res.data;
        if (!Array.isArray(comments)) comments = [];
        comments = comments.map((c: any) => ({
          id: String(c.id),
          name: c.name || "Anonymous",
          email: c.email || "",
          comment: c.content || c.comment || "",
          status: c.status === "rejected" ? "spam" : (c.status || "pending"),
          createdAt: c.created_at || c.createdAt || new Date().toISOString(),
          blogTitle: post.title,
          blogSlug: post.slug,
          blogId: String(post.id),
        }));
        allComments.push(...comments);
      } catch (e) { /* skip */ }
    }
    return allComments;
  } catch (error) {
    console.error("Fallback also failed:", error);
    return [];
  }
};

export const approveComment = async (id: string) => {
  await api.patch(`/v1/comments/${id}`, { status: "approved" });
};

export const rejectComment = async (id: string) => {
  await api.patch(`/v1/comments/${id}`, { status: "rejected" });
};

export const deleteComment = async (id: string) => {
  await api.delete(`/v1/comments/${id}`);
};