import api from "./api";
export async function getBlogCount(): Promise<number> {
  try {
    const response = await api.get("/v1/blog-posts");
    const data = response.data;

    if (data.data?.data?.data && Array.isArray(data.data.data.data)) return data.data.data.data.length;
    if (data.data?.data && Array.isArray(data.data.data)) return data.data.data.length;
    if (Array.isArray(data.data)) return data.data.length;
    if (Array.isArray(data)) return data.length;
    if (data.total !== undefined) return Number(data.total);
    if (data.data?.total !== undefined) return Number(data.data.total);

    return 0;
  } catch (error: any) {
    return 0;
  }
}
