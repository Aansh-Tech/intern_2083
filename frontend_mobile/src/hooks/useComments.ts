import { useState } from 'react';
import api from '../services/api';

export function useComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Public: submit comment
  const postComment = async (data: {
    blog_post_id: string;
    name: string;
    email: string;
    content: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/v1/comments', data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to post comment.';
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        message = Object.keys(errors)
          .map(f => `${f}: ${errors[f].join(', ')}`)
          .join('\n');
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  
  const fetchComments = async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/v1/blog-posts/${slug}/comments`);
      
      let comments = [];
      if (Array.isArray(response.data)) {
        comments = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        comments = response.data.data;
      } else if (response.data?.comments && Array.isArray(response.data.comments)) {
        comments = response.data.comments;
      } else {
        console.warn('Unexpected comment response:', response.data);
        comments = [];
      }
      setLoading(false);
      return comments;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch comments';
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  };

  
  const deleteComment = async (id: string) => {
    setLoading(true);
    setError(null);
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