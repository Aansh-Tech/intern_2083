// src/hooks/useComments.ts
import { useState } from 'react';
import api from '../services/api';

export function useComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postComment = async (data: { blog_post_id: string; name: string; email: string; content: string }) => {
    setLoading(true);
    try {
      const response = await api.post('/v1/comments', data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to post comment.';
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  const fetchComments = async (slug: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/v1/blog-posts/${slug}/comments`);
      let comments = response.data?.data || response.data;
      if (!Array.isArray(comments)) comments = [];
      setLoading(false);
      return comments;
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.warn("Unauthorized – token missing. Returning empty comments.");
        setLoading(false);
        return [];
      }
      const message = err.response?.data?.message || 'Failed to fetch comments';
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  const deleteComment = async (id: string) => {
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
  };

  return { postComment, fetchComments, deleteComment, loading, error };
}