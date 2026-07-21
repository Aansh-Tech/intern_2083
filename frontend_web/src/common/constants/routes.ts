// common/constants/routes.ts

export const ROUTES = {
  home: "/",
  about: "/about",
  projects: "/projects",
  projectDetails: (slug: string) => `/projects/${slug}`,
  blog: "/blog",
  blogDetails: (slug: string) => `/blog/${slug}`,
  contact: "/contact",

  adminLogin: "/admin/login",
  adminDashboard: "/admin/dashboard",
  adminProjects: "/admin/projects",
  adminSkills: "/admin/skills",
  adminSocialLinks: "/admin/social-links",
  adminForgotPassword: "/admin/forgot-password",
  adminResetPassword: "/reset-password",

  // Disabled until backend support exists — see routes.tsx for commented-out routes
  // adminContactMessages: "/admin/contact-messages",
  adminBlogPosts: "/admin/blog-posts",
  // adminComments: "/admin/comments",
  adminCertificates: "/admin/certificates",
} as const;

export const NAV_LINKS = [
  { label: "Home", to: ROUTES.home },
  { label: "About", to: ROUTES.about },
  { label: "Projects", to: ROUTES.projects },
  { label: "Blog", to: ROUTES.blog },
  { label: "Contact", to: ROUTES.contact },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", to: ROUTES.adminDashboard },
  { label: "Projects", to: ROUTES.adminProjects },
  { label: "Skills", to: ROUTES.adminSkills },
  { label: "Social Links", to: ROUTES.adminSocialLinks },
] as const;