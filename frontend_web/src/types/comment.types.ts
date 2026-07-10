export interface Comment {
  id: number;
  blog_post_id: number;
  name: string;
  email: string;
  content: string;
  status: "pending" | "approved";
  created_at?: string;
}