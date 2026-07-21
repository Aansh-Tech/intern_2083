import api from "./api";

export interface BackendSkill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  display_order?: number;
  created_at?: string;
}

function mapSkill(item: BackendSkill) {
  return {
    id: String(item.id),
    category: mapCategory(item.category),
    name: item.name,
    percentage: item.proficiency,
    createdAt: item.created_at ?? new Date().toISOString(),
  };
}

function mapCategory(category: string): "Frontend" | "Backend" | "Design" | "Other" {
  const lower = category.toLowerCase();
  if (lower === "frontend") return "Frontend";
  if (lower === "backend") return "Backend";
  if (lower === "design") return "Design";
  return "Other";
}

export async function getSkills() {
  //console.log("[skillService] getSkills() called, calling GET /v1/skills");
  const response = await api.get("/v1/skills");
  //console.log("[skillService] GET /v1/skills response status:", response.status);
  //console.log("[skillService] response.data type:", typeof response.data, "isArray:", Array.isArray(response.data));
  //console.log("[skillService] response.data.data type:", typeof response.data.data, "isArray:", Array.isArray(response.data.data));
  //console.log("[skillService] response.data keys:", Object.keys(response.data));
  const rawItems = response.data.data ?? response.data ?? [];
  //console.log("[skillService] raw items type:", typeof rawItems, "isArray:", Array.isArray(rawItems));
  if (!Array.isArray(rawItems)) {
    //console.log("[skillService] WARNING: rawItems is NOT an array!", JSON.stringify(rawItems).substring(0, 200));
    return [];
  }
  //console.log("[skillService] raw items count:", rawItems.length);
  const items: BackendSkill[] = rawItems;
  const mapped = items.map(mapSkill);
  //console.log("[skillService] mapped skills count:", mapped.length);
  if (mapped.length > 0) {
    //console.log("[skillService] first mapped skill:", JSON.stringify(mapped[0]));
  }
  return mapped;
}

export async function createSkill(data: {
  name: string;
  category: string;
  proficiency: number;
}) {
  //console.log("[skillService] createSkill() called with data:", JSON.stringify(data));
  try {
    const response = await api.post("/v1/skills", data);
    //console.log("[skillService] POST /v1/skills response status:", response.status);
    //console.log("[skillService] POST /v1/skills response.data:", JSON.stringify(response.data).substring(0, 300));
    const item: BackendSkill = response.data.data ?? response.data;
    const mapped = mapSkill(item);
    //console.log("[skillService] createSkill mapped result:", JSON.stringify(mapped));
    return mapped;
  } catch (error: any) {
    //console.log("[skillService] createSkill FAILED");
    //console.log("[skillService] error.message:", error.message);
    //console.log("[skillService] error.response?.status:", error.response?.status);
    //console.log("[skillService] error.response?.data:", JSON.stringify(error.response?.data));
    throw error;
  }
}

export async function updateSkill(
  id: string,
  data: { name?: string; category?: string; proficiency?: number }
) {
  const response = await api.put(`/v1/skills/${id}`, data);
  const item: BackendSkill = response.data.data ?? response.data;
  return mapSkill(item);
}

export async function deleteSkill(id: string) {
  await api.delete(`/v1/skills/${id}`);
}
