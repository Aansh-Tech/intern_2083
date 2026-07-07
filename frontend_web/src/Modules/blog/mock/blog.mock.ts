import type { BlogPost } from "../../../types/blogPost.types";
import type { Comment } from "../../../types/comment.types";

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "designing-for-quiet-interfaces",
    title: "Designing for Quiet Interfaces",
    excerpt: "Why restraint is the hardest and most valuable design skill.",
    content:
      "Most interfaces fail not because they lack features, but because they never stop talking. Every badge, banner, and animation is competing for the same sliver of attention.\n\nA quiet interface trusts the user. It shows exactly what's needed, when it's needed, and gets out of the way otherwise.\n\nThis doesn't mean minimal for its own sake — it means every element earns its place.",
    publishedAt: "2026-06-12",
  },
  {
    id: "2",
    slug: "state-management-in-2026",
    title: "State Management in 2026",
    excerpt: "A practical look at where the ecosystem has settled.",
    content:
      "After years of churn, the state management conversation has quieted down. Most teams now reach for a mix of server state libraries and small, local component state, rather than one global store for everything.\n\nThe lesson: not all state is equal, and treating it that way was the real source of complexity.",
    publishedAt: "2026-05-28",
  },
  {
    id: "3",
    slug: "shipping-fast-without-breaking-things",
    title: "Shipping Fast Without Breaking Things",
    excerpt: "Notes on velocity, testing, and trust in small teams.",
    content:
      "Speed and stability aren't opposites — they're both downstream of clarity. Teams that ship fast without breaking things usually have very clear boundaries around what needs review and what doesn't.\n\nThe fastest teams I've worked with test the parts that are expensive to get wrong, and move quickly everywhere else.",
    publishedAt: "2026-05-10",
  },
];

export const mockComments: Comment[] = [
  {
    id: "1",
    blogPostId: "1",
    name: "Priya S.",
    content: "This really reframed how I think about empty states. Thanks!",
    createdAt: "2026-06-13",
  },
  {
    id: "2",
    blogPostId: "1",
    name: "Daniel K.",
    content: "Would love a follow-up post with concrete before/after examples.",
    createdAt: "2026-06-14",
  },
];