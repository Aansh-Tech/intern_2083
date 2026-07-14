import api from "./api";

export const getBlogs = async () => {
  const response = await api.get("/blogs");
  return response.data;
};

export const getBlog = async (id: number | string) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
};

export const createBlog = async (data: any) => {
  const response = await api.post("/blogs", data);
  return response.data;
};

export const updateBlog = async (id: number | string, data: any) => {
  const response = await api.put(`/blogs/${id}`, data);
  return response.data;
};

export const deleteBlog = async (id: number | string) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};