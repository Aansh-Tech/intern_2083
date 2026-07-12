export type CommentStatus = "pending" | "approved" | "spam";

export interface Comment {
  id: string;
  blogId: string;
  blogTitle: string;
  name: string;
  email: string;
  comment: string;
  createdAt: string;
  status: CommentStatus;
}
