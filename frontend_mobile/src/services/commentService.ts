import api from "./api";

// Get comments for a specific blog post
export const getComments = async (blogId: number | string) => {
  const response = await api.get(`/blogs/${blogId}/comments`);
  return response.data;
};

// Public: visitor posts a comment
export const createComment = async (
  blogId: number | string,
  data: { name: string; email?: string; comment: string }
) => {
  const response = await api.post(`/blogs/${blogId}/comments`, data);
  return response.data;
};

// Admin: delete a comment
export const deleteComment = async (id: number | string) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};

// Admin: approve/moderate a comment (if you have moderation)
export const approveComment = async (id: number | string) => {
  const response = await api.patch(`/comments/${id}`, { approved: true });
  return response.data;
}; 