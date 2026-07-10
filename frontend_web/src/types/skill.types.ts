export interface Skill {
  id: string;
  profile_id: string;
  name: string;
  photo?: string;
  display_order?: number;
  percentage?: number;
  category?: string;
  certificate_image?: string; // NEW -- not in the original DB schema, confirm with backend that /v1/skills accepts this field
}