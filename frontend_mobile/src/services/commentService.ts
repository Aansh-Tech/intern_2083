import api from "./api";
import { getToken } from "../utils/token";
import type { Comment } from "../types/comment";


const unwrapList = (response: any): any[] => {
  const raw = response.data;

  if (raw?.data?.data && Array.isArray(raw.data.data)) {
    return raw.data.data;
  }
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw?.data && Array.isArray(raw.data)) {
    return raw.data;
  }
  if (raw?.comments && Array.isArray(raw.comments)) {
    return raw.comments;
  }

  for (const key of Object.keys(raw || {})) {
    if (Array.isArray(raw[key])) {
      return raw[key];
    }
  }

  return [];
};

const mapComment = (c: any, blogTitle?: string, blogSlug?: string, blogId?: string): Comment => ({
  id: String(c.id),
  name: c.name || "Anonymous",
  email: c.email || "",
  comment: c.content || c.comment || "",
  status: c.status === "rejected" ? "spam" : (c.status || "pending"),
  createdAt: c.created_at || c.createdAt || new Date().toISOString(),
  blogTitle: blogTitle || c.blog_post?.title || "Unknown Post",
  blogSlug: blogSlug || c.blog_post?.slug || "",
  blogId: blogId || (c.blog_post?.id ? String(c.blog_post.id) : ""),
});

export const getAllComments = async (): Promise<Comment[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated – no token stored. Skipping /v1/comments request.");
  }
  try {
    const response = await api.get("/v1/comments");
    const items = unwrapList(response);
    const mapped = items.map((c: any) => mapComment(c));
    return mapped;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw error;
    }
    return getAllCommentsFallback();
  }
};

const getAllCommentsFallback = async (): Promise<Comment[]> => {
  try {
    const postsResponse = await api.get("/v1/blog-posts");
    const postsData = unwrapList(postsResponse);

    const allComments: Comment[] = [];
    for (const post of postsData) {
      try {
        const res = await api.get(`/v1/blog-posts/${post.slug}/comments`);
        const comments = unwrapList(res);
        allComments.push(
          ...comments.map((c: any) =>
            mapComment(c, post.title, post.slug, String(post.id))
          )
        );
      } catch (e) {
        // ignore
      }
    }
    return allComments;
  } catch (error) {
    console.error("[commentService] Fallback also failed:", error);
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
