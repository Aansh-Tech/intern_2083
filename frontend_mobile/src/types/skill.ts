export type SkillCategory = "Frontend" | "Backend" | "Design" | "Other";

export interface Skill {
  id: string;
  category: SkillCategory;
  name: string;
  percentage: number;
  createdAt: string;
}
