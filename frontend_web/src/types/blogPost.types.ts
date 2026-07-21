export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  published_at: string;
  created_at: string;
}