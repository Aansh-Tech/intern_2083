import api from "./api";

export async function getBlogCount(): Promise<number> {
  try {
    const response = await api.get("/blogs");
    const data = response.data;

    if (Array.isArray(data)) return data.length;
    if (data.data && Array.isArray(data.data)) return data.data.length;

    return 0;
  } catch {
    return 0;
  }
}
