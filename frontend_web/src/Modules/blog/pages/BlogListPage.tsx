import { useState, useEffect } from "react";
import { BlogCard } from "../components/BlogCard";
import { EmptyState } from "../../../common/components/EmptyState";
import { getBlogPosts } from "../services/blog.service";
import type { BlogPost } from "../../../types/blogPost.types";

// Hardcoded mock data as fallback (since Blog API is EMPTY)
const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    slug: "getting-started-with-react-typescript",
    excerpt: "Learn how to build type-safe React applications with TypeScript",
    content: "Full blog content here...",
    cover_image: "/images/blog1.jpg",
    published_at: "2024-01-15",
    status: "published",
    author: "Marchetti",
    created_at: "2024-01-15",
    updated_at: "2024-01-15"
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS in 2024",
    slug: "mastering-tailwind-css-2024",
    excerpt: "Advanced techniques for building beautiful UIs with Tailwind",
    content: "Full blog content here...",
    cover_image: "/images/blog2.jpg",
    published_at: "2024-02-01",
    status: "published",
    author: "Marchetti",
    created_at: "2024-02-01",
    updated_at: "2024-02-01"
  },
  {
    id: 3,
    title: "Building a Personal Portfolio with React",
    slug: "building-personal-portfolio-react",
    excerpt: "Step by step guide to creating your own portfolio website",
    content: "Full blog content here...",
    cover_image: "/images/blog3.jpg",
    published_at: "2024-03-01",
    status: "published",
    author: "Marchetti",
    created_at: "2024-03-01",
    updated_at: "2024-03-01"
  }
];

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const response = await getBlogPosts();
        setPosts(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        // Use mock data since API is not ready
        setPosts(MOCK_BLOG_POSTS);
        setError('Using mock data (Blog API not ready yet)');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-500 dark:text-slate-400">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Journal
      </h1>
      <p className="mt-2 max-w-lg text-slate-500 dark:text-slate-400">
        Writing on design, engineering, and building calm software.
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
          ⚠️ {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No posts published yet" />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}