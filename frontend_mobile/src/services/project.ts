import api from "./api";

export async function getProjects() {
  const response = await api.get("/v1/projects");
  return response.data.data;
}

export async function getFeaturedProjects() {
  const response = await api.get("/v1/projects/featured");
  return response.data.data;
}

export async function getProject(slug: string) {
  const response = await api.get(`/v1/projects/${slug}`);
  return response.data.data;
}

export async function createProject(data: any) {
  const response = await api.post("/v1/projects", data);
  return response.data.data;
}

export async function updateProject(id: string, data: any) {
  const response = await api.put(`/v1/projects/${id}`, data);
  return response.data.data;
}

export async function deleteProject(id: string) {
  await api.delete(`/v1/projects/${id}`);
}