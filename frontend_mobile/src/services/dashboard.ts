import api from "./api";

export async function getBlogCount(): Promise<number> {
  try {
    const response = await api.get("/v1/blog-posts");
    const data = response.data;
    console.log("[dashboard] getBlogCount - response structure:", JSON.stringify(data).substring(0, 300));

    if (data.data?.data?.data && Array.isArray(data.data.data.data)) return data.data.data.data.length;
    if (data.data?.data && Array.isArray(data.data.data)) return data.data.data.length;
    if (Array.isArray(data.data)) return data.data.length;
    if (Array.isArray(data)) return data.length;
    if (data.total !== undefined) return Number(data.total);
    if (data.data?.total !== undefined) return Number(data.data.total);

    console.warn("[dashboard] getBlogCount - could not determine count from response");
    return 0;
  } catch (error: any) {
    console.warn("[dashboard] getBlogCount - failed:", error.response?.status, error.message);
    return 0;
  }
}
