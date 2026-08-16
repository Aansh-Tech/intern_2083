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
  const response = await api.get("/v1/skills");
  const rawItems = response.data.data ?? response.data ?? [];
  if (!Array.isArray(rawItems)) {
    return [];
  }
  const items: BackendSkill[] = rawItems;
  const mapped = items.map(mapSkill);
  return mapped;
}

export async function createSkill(data: {
  name: string;
  category: string;
  proficiency: number;
}) {
  try {
    const response = await api.post("/v1/skills", data);
    const item: BackendSkill = response.data.data ?? response.data;
    const mapped = mapSkill(item);
    return mapped;
  } catch (error: any) {
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
