import type { Comment } from "../types/comment";

export const seedComments: Comment[] = [
  {
    id: "comment-1",
    blogId: "1",
    blogTitle: "Designing for Quiet Interfaces",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    comment:
      "This article really resonated with me. I've been struggling with visual noise in my designs and your points about intentional whitespace are incredibly helpful.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "pending",
  },
  {
    id: "comment-2",
    blogId: "1",
    blogTitle: "Designing for Quiet Interfaces",
    name: "Marcus Chen",
    email: "marcus.chen@gmail.com",
    comment:
      "Great read! I'd love to see a follow-up on how this applies to mobile interfaces specifically. The principles translate well but the constraints are quite different.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "approved",
  },
  {
    id: "comment-3",
    blogId: "2",
    blogTitle: "Shipping a Design System in a Quarter",
    name: "Anika Patel",
    email: "anika.patel@gmail.com",
    comment:
      "Shipping a design system in a quarter sounds ambitious but your breakdown makes it feel achievable. The token-first approach is key.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "approved",
  },
  {
    id: "comment-4",
    blogId: "2",
    blogTitle: "Shipping a Design System in a Quarter",
    name: "Tom Baker",
    email: "tom.baker@gmail.com",
    comment:
      "Check out my website for cheap design system templates!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "spam",
  },
  {
    id: "comment-5",
    blogId: "3",
    blogTitle: "Notes on Typography for Product Interfaces",
    name: "Elena Voss",
    email: "elena.voss@gmail.com",
    comment:
      "Typography is the foundation of good design. Your note on line-height ratios for body text is exactly what I needed to refine our component library.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "pending",
  },
];
