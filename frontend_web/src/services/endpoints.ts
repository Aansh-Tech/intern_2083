export const ENDPOINTS = {
  profile: "/v1/profile",
  skills: "/v1/skills",
  socialLinks: "/v1/social-links",

  projects: "/v1/projects",
  projectsFeatured: "/v1/projects/featured",
  projectBySlug: (slug: string) => `/v1/projects/${slug}`,

  blogPosts: "/v1/blog-posts",
  blogPostBySlug: (slug: string) => `/v1/blog-posts/${slug}`,

  comments: "/v1/comments",
  commentsByPostSlug: (slug: string) => `/v1/blog-posts/${slug}/comments`,

  contact: "/v1/contact",
  contactById: (id: number) => `/v1/contact/${id}`,

  certificates: "/v1/certificates",
  certificateById: (id: number) => `/v1/certificates/${id}`,
} as const;