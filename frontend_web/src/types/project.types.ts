export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  status: string; // ambiguous — backend uses this for "published"/"draft" visibility,
                   // but UI also needs Completed/In-Progress. Typed loosely as string
                   // until this is resolved with backend. See ProjectFilterTabs below.
  category?: string; // NOT in backend schema yet — optional, hidden gracefully when absent
  is_featured: boolean;
  github_link?: string;
  live_link?: string;
  images?: string[]; // for gallery/carousel on details page
  created_at: string;
}