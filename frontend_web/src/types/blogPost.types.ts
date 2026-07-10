export interface BlogPost {
  id: number;
  profile_id?: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  category?: string | null;
  tags?: string[] | null;
  status: "draft" | "published" | "archived";
  published_at?: string | null;
  allow_comments: boolean;
  created_at?: string;
  updated_at?: string;
}