/**
 * NOTE: CommentController is currently empty on the backend -- no
 * index()/store() methods exist yet. This shape is a best guess based on
 * the comments table from the DB diagram (blog_post_id, name, email,
 * content, status for approval). Confirm real field names once the
 * controller is implemented.
 */
export interface Comment {
  id: string;
  blogPostId: string;
  name: string;
  content: string;
  createdAt: string; // ISO date string
}