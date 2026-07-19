import { useState, useCallback } from 'react';
import api from '../services/api';


console.log = () => {};
console.info = () => {};
console.debug = () => {};

const normalizeComment = (c: any): any => ({
  id: String(c.id),
  blog_post_id: c.blog_post_id,
  name: c.name || "Anonymous",
  email: c.email || "",
  comment: c.content || c.comment || "",
  status: c.status || "pending",
  createdAt: c.created_at || c.createdAt || new Date().toISOString(),
});

const unwrapList = (response: any): any[] => {
  const raw = response.data;
  console.log("[useComments] unwrapList - COMPLETE RESPONSE:", JSON.stringify(response.data, null, 2).substring(0, 500));

  if (raw?.data?.data && Array.isArray(raw.data.data)) {
    console.log("[useComments] unwrapList - matched 3-level nesting (data.data.data)");
    return raw.data.data;
  }
  if (Array.isArray(raw)) {
    console.log("[useComments] unwrapList - matched direct array");
    return raw;
  }
  if (raw?.data && Array.isArray(raw.data)) {
    console.log("[useComments] unwrapList - matched 2-level nesting (data.data)");
    return raw.data;
  }
  if (raw?.comments && Array.isArray(raw.comments)) {
    console.log("[useComments] unwrapList - matched raw.comments");
    return raw.comments;
  }

  for (const key of Object.keys(raw || {})) {
    if (Array.isArray(raw[key])) {
      console.log("[useComments] unwrapList - found array under key:", key);
      return raw[key];
    }
  }

  console.warn("[useComments] unwrapList - no array found in response, returning empty. Keys:", Object.keys(raw || {}));
  return [];
};

export function useComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postComment = useCallback(async (data: { blog_post_id: string; name: string; email: string; content: string }) => {
    console.log("[useComments] postComment - blog_post_id:", data.blog_post_id, "name:", data.name);
    setLoading(true);
    try {
      const response = await api.post('/v1/comments', data);
      console.log("[useComments] postComment - success, status:", response.status);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      console.warn("[useComments] postComment - failed:", err.response?.status, err.response?.data);
      const message = err.response?.data?.message || 'Failed to post comment.';
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  }, []);

  const fetchComments = useCallback(async (slug: string) => {
    console.log("[useComments] fetchComments - slug:", slug, "URL:", `/v1/blog-posts/${slug}/comments`);
    setLoading(true);
    try {
      const response = await api.get(`/v1/blog-posts/${slug}/comments`);
      console.log("[useComments] fetchComments - status:", response.status);
      const raw = unwrapList(response);
      console.log("[useComments] fetchComments - raw count:", raw.length);
      if (raw.length > 0) {
        console.log("[useComments] fetchComments - first raw item:", JSON.stringify(raw[0]).substring(0, 300));
        const statuses = [...new Set(raw.map((c: any) => c.status))];
        console.log("[useComments] fetchComments - unique status values:", statuses);
      }
      const comments = raw.map(normalizeComment);
      console.log("[useComments] fetchComments - normalized count:", comments.length);
      if (comments.length > 0) {
        console.log("[useComments] fetchComments - first normalized item:", JSON.stringify(comments[0]).substring(0, 300));
      }
      setLoading(false);
      return comments;
    } catch (err: any) {
      console.warn("[useComments] fetchComments - FAILED:", err.response?.status, err.message);
      console.warn("[useComments] fetchComments - error details:", JSON.stringify(err.response?.data || {}).substring(0, 300));
      setLoading(false);
      return [];
    }
  }, []);

  const deleteComment = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/v1/comments/${id}`);
      setLoading(false);
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete comment';
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  }, []);

  return { postComment, fetchComments, deleteComment, loading, error };
}
