import api from "./api";

// Public: visitor submits contact form
export const submitContact = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  const response = await api.post("/contact", data);
  return response.data;
};

// Admin: view inbox messages
export const getContacts = async () => {
  const response = await api.get("/contacts");
  return response.data;
};

export const getContact = async (id: number | string) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

export const deleteContact = async (id: number | string) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

// Optional: mark as read
export const markContactAsRead = async (id: number | string) => {
  const response = await api.patch(`/contacts/${id}`, { read: true });
  return response.data;
};