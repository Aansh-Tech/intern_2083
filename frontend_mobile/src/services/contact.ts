import api from "./api";

// Public: Send contact message
// export async function submitContact(data: {
//   name: string;
//   email: string;
//   subject?: string;
//   message: string;
// }) {
//   const response = await api.post("/v1/contact", data);

//   return response.data.data;
// }
export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const response = await api.post("/v1/contact", data);

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
} 

// Admin: Get all inbox messages
export async function getContacts() {
  const response = await api.get("/v1/contact");

  return response.data.data;
}

// Admin: Delete a message
export async function deleteContact(id: number | string) {
  const response = await api.delete(`/v1/contact/${id}`);

  return response.data;
}