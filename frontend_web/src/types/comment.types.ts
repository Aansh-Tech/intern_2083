export interface Comment {
  id: number;
  blog_post_id: number;
  name: string;
  email: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
}
export interface CommentPayload {
  blog_post_id: number;
  name: string;
  email: string;
  content: string;
}