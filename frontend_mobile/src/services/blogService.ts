import api from "./api";

const unwrapList = (response: any): any[] => {
  if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
    return response.data.data.data;
  }
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};

const unwrapItem = (response: any): any => {
  if (response.data?.data?.data) return response.data.data.data;
  if (response.data?.data) return response.data.data;
  return response.data;
};

export const getBlogs = async () => {
  const response = await api.get("/v1/blog-posts");
  return unwrapList(response);
};

export const getBlog = async (slug: string) => {
  const response = await api.get(`/v1/blog-posts/${slug}`);
  return unwrapItem(response);
};

export const createBlog = async (data: any) => {
  const response = await api.post("/v1/blog-posts", data);
  return unwrapItem(response);
};

export const updateBlog = async (id: number | string, data: any) => {
  const response = await api.put(`/v1/blog-posts/${id}`, data);
  return unwrapItem(response);
};

export const deleteBlog = async (id: number | string) => {
  const response = await api.delete(`/v1/blog-posts/${id}`);
  return response.data;
};
