/**
 * NOTE: BlogPostController is currently empty on the backend -- no
 * index()/show() methods exist yet. This shape is a best guess based on
 * the blog_posts table from the DB diagram. Confirm real field names once
 * the controller is implemented (e.g. it may return excerpt as null, or
 * use a different date field name than published_at).
 */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string; // ISO date string
}