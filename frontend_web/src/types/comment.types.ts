export interface Comment {
  id: number;
  blog_post_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface CommentPayload {
  author_name: string;
  content: string;
}