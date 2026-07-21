/**
 * Central map of API endpoints.
 *
 * These paths are confirmed against the real controllers your backend
 * friend shared: ProfileController, ProjectController, SkillController,
 * SocialLinkController are live. BlogPostController, CommentController,
 * and ContactController are still empty -- their paths below are the
 * conventional Laravel routes to use once those controllers are filled in.
 */
export const ENDPOINTS = {
  profile: "/profile",
  skills: "/skills",
  socialLinks: "/social-links",

  projects: "/projects",
  projectsFeatured: "/projects/featured",
  projectBySlug: (slug: string) => `/projects/${slug}`,

  // not live yet -- BlogPostController has no methods
  blogPosts: "/blog-posts",
  blogPostBySlug: (slug: string) => `/blog-posts/${slug}`,

  // not live yet -- CommentController has no methods
  commentsByPost: (blogPostId: string) =>
    `/blog-posts/${blogPostId}/comments`,

  // not live yet -- ContactController has no methods
  contactMessages: "/contact-messages",
} as const;