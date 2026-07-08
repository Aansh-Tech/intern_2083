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
} as const;

export const NAV_LINKS = [
  { label: "Home", to: ROUTES.home },
  { label: "About", to: ROUTES.about },
  { label: "Projects", to: ROUTES.projects },
  { label: "Blog", to: ROUTES.blog },
  { label: "Contact", to: ROUTES.contact },
] as const;