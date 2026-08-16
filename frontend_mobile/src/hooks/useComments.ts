import { useState, useCallback, useRef, useEffect } from 'react';
import api from '../services/api';



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

export function useComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const postComment = useCallback(async (data: { blog_post_id: string; name: string; email: string; content: string }) => {
    setLoading(true);
    try {
      const response = await api.post('/v1/comments', data);
      if (!mountedRef.current) return response.data;
      setLoading(false);
      return response.data;
    } catch (err: any) {
      if (!mountedRef.current) throw err;
      const message = err.response?.data?.message || 'Failed to post comment.';
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  }, []);

  const fetchComments = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/v1/blog-posts/${slug}/comments`);
      if (!mountedRef.current) return [];
      const raw = unwrapList(response);
      const comments = raw.map(normalizeComment);
      setLoading(false);
      return comments;
    } catch (err: any) {
      if (!mountedRef.current) return [];
      setLoading(false);
      return [];
    }
  }, []);

  const deleteComment = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/v1/comments/${id}`);
      if (!mountedRef.current) return false;
      setLoading(false);
      return true;
    } catch (err: any) {
      if (!mountedRef.current) throw err;
      const message = err.response?.data?.message || 'Failed to delete comment';
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  }, []);

  return { postComment, fetchComments, deleteComment, loading, error };
}
