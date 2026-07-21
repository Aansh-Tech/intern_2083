import api from "./api";
import type { Comment } from "../types/comment";

console.log = () => {};
console.info = () => {};
console.debug = () => {};

const unwrapList = (response: any): any[] => {
  console.log("[commentService] unwrapList - COMPLETE RESPONSE:", JSON.stringify(response.data, null, 2).substring(0, 500));
  const raw = response.data;

  if (raw?.data?.data && Array.isArray(raw.data.data)) {
    console.log("[commentService] unwrapList - matched 3-level nesting (data.data.data), count:", raw.data.data.length);
    return raw.data.data;
  }
  if (Array.isArray(raw)) {
    console.log("[commentService] unwrapList - matched direct array, count:", raw.length);
    return raw;
  }
  if (raw?.data && Array.isArray(raw.data)) {
    console.log("[commentService] unwrapList - matched 2-level nesting (data.data), count:", raw.data.length);
    return raw.data;
  }
  if (raw?.comments && Array.isArray(raw.comments)) {
    console.log("[commentService] unwrapList - matched raw.comments, count:", raw.comments.length);
    return raw.comments;
  }

  for (const key of Object.keys(raw || {})) {
    if (Array.isArray(raw[key])) {
      console.log("[commentService] unwrapList - found array under key:", key, "count:", raw[key].length);
      return raw[key];
    }
  }

  console.warn("[commentService] unwrapList - no array found in response, returning empty. Keys:", Object.keys(raw || {}));
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
  console.log("[commentService] getAllComments - fetching /v1/comments");
  try {
    const response = await api.get("/v1/comments");
    console.log("[commentService] getAllComments - response status:", response.status);
    const items = unwrapList(response);
    console.log("[commentService] getAllComments - parsed items count:", items.length);
    if (items.length > 0) {
      console.log("[commentService] getAllComments - first item id:", items[0].id, "name:", items[0].name);
      console.log("[commentService] getAllComments - first item status:", items[0].status);
      console.log("[commentService] getAllComments - statuses:", [...new Set(items.map((c: any) => c.status))]);
    }
    const mapped = items.map((c: any) => mapComment(c));
    console.log("[commentService] getAllComments - mapped count:", mapped.length);
    return mapped;
  } catch (error: any) {
    console.warn("[commentService] getAllComments - request failed, status:", error.response?.status, "message:", error.message);
    if (error.response?.status === 401) {
      console.warn("[commentService] Unauthorized – token missing or invalid. Returning empty comments.");
      return [];
    }
    console.warn("[commentService] Global comments endpoint failed, using fallback.");
    return getAllCommentsFallback();
  }
};

const getAllCommentsFallback = async (): Promise<Comment[]> => {
  console.log("[commentService] getAllCommentsFallback - fetching all blog posts for per-post comments");
  try {
    const postsResponse = await api.get("/v1/blog-posts");
    const postsData = unwrapList(postsResponse);
    console.log("[commentService] getAllCommentsFallback - found", postsData.length, "blog posts");

    const allComments: Comment[] = [];
    for (const post of postsData) {
      try {
        console.log("[commentService] getAllCommentsFallback - fetching comments for post slug:", post.slug);
        const res = await api.get(`/v1/blog-posts/${post.slug}/comments`);
        const comments = unwrapList(res);
        console.log("[commentService] getAllCommentsFallback - found", comments.length, "comments for post:", post.slug);
        allComments.push(
          ...comments.map((c: any) =>
            mapComment(c, post.title, post.slug, String(post.id))
          )
        );
      } catch (e) {
        console.warn("[commentService] getAllCommentsFallback - failed for post slug:", post.slug, (e as any).message);
      }
    }
    console.log("[commentService] getAllCommentsFallback - total comments found:", allComments.length);
    return allComments;
  } catch (error) {
    console.error("[commentService] Fallback also failed:", error);
    return [];
  }
};

export const approveComment = async (id: string) => {
  console.log("[commentService] approveComment - id:", id);
  await api.patch(`/v1/comments/${id}`, { status: "approved" });
};

export const rejectComment = async (id: string) => {
  console.log("[commentService] rejectComment - id:", id);
  await api.patch(`/v1/comments/${id}`, { status: "rejected" });
};

export const deleteComment = async (id: string) => {
  console.log("[commentService] deleteComment - id:", id);
  await api.delete(`/v1/comments/${id}`);
};
