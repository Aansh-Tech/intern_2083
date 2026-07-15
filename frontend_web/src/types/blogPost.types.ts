export interface BlogPostImage {
  id: number;
  type: string;
  display_order: number;
  is_primary: boolean;
  image: {
    id: number;
    filename: string;
    alt_text?: string | null;
    caption?: string | null;
    url: string;
  } | null;
}

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
  images?: BlogPostImage[];
  created_at?: string;
  updated_at?: string;
}