export interface Skill {
  id: string;
  profile_id: string;
  name: string;
  photo?: string;
  display_order?: number;
  proficiency?: number; // renamed from `percentage` — confirmed real field, 0–100
  category?: string; // still not in DB schema — unchanged
}