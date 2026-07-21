/**
 * Matches the real Skill model (Skill::orderBy('display_order')->get()).
 * NOTE: the backend schema has NO percentage/level field -- only name,
 * photo, and display_order. The live UI design shows skill bars with a %
 * value, so this needs one of:
 *   1. Ask the backend to add a `percentage` (or `level`) column, or
 *   2. Drop the percentage bar from the UI and just list skill names.
 * Until that's decided, percentage is optional here and the SkillBarList
 * component falls back to a plain list (no bar) when it's missing.
 */
export interface Skill {
  id: string;
  profile_id: string;
  name: string;
  photo?: string;
  display_order?: number;
  percentage?: number; // not in the current DB schema -- see note above
  category?: string; // also not in the current schema -- grouping (Frontend/Backend/Design) needs a home
}