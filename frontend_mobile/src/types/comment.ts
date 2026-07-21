export type CommentStatus = "pending" | "approved" | "spam";

export interface Comment {
  id: string;
  blogId?: string;        // optional, can be used internally
  blogTitle: string;
  blogSlug?: string;
  name: string;
  email: string;
  comment: string;        // the actual content
  status: CommentStatus;
  createdAt: string;      // ISO date string
}
