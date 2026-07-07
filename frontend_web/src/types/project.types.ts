/**
 * Matches the real Project model as returned by ProjectController (raw
 * Eloquent, snake_case, not wrapped in a Resource).
 *
 * IMPORTANT -- unresolved with backend: ProjectController@index filters
 * `where('status', 'published')`, meaning `status` is being used as a
 * visibility flag (draft/published). But the live UI has filter tabs for
 * "Completed" / "In Progress", which implies status also needs to carry
 * that information. Confirm with the backend whether:
 *   a) status holds ONLY draft/published, and a separate field is needed
 *      for completed/in-progress, or
 *   b) status is overloaded to hold all four values.
 * Until confirmed, `status` is typed loosely as `string` so the filter
 * logic doesn't silently break against real data.
 */
export interface Project {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  github_link?: string;
  live_link?: string;
  is_featured: boolean;
  status: string; // see note above -- shape not fully confirmed yet
  category?: string; // NOT in the current DB schema -- UI shows category tags but backend has no column for it yet. Ask backend to add it, or drop from UI.
  images?: string[];
  created_at?: string;
  updated_at?: string;
}