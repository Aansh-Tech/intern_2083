import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../common/components/Button";
import { EmptyState } from "../../../common/components/EmptyState";
import { formatDate } from "../../../common/utils/formatDate";
import { ROUTES } from "../../../common/constants/routes";
import { CommentList } from "../components/CommentList";
import { CommentForm } from "../components/CommentForm";
import { getBlogPostBySlug } from "../services/blog.service";
import { getCommentsByPost } from "../services/comments.service";
import type { BlogPost } from "../../../types/blogPost.types";
import type { Comment } from "../../../types/comment.types";

// Hardcoded mock data as fallback (since Blog API is EMPTY)
const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    slug: "getting-started-with-react-typescript",
    excerpt: "Learn how to build type-safe React applications with TypeScript",
    content: "React and TypeScript have become the go-to combination for building modern web applications. In this post, we'll explore how to set up a new project, define types for props and state, and leverage TypeScript's powerful type system to catch errors early.\n\nWe'll cover essential patterns like using interfaces for props, typing event handlers, and working with hooks. By the end, you'll have a solid foundation for building type-safe React applications.",
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
    content: "Tailwind CSS has revolutionized how we style web applications. In this comprehensive guide, we'll dive deep into advanced techniques including custom configurations, responsive design patterns, and optimizing for production.\n\nLearn how to create reusable component classes, use the @apply directive effectively, and build complex layouts with minimal CSS. We'll also explore how to customize your tailwind.config.js to match your brand's design system.",
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
    content: "Your portfolio is your digital identity. In this step-by-step guide, we'll build a modern portfolio website from scratch using React, TypeScript, and Tailwind CSS.\n\nWe'll cover everything from project setup to deployment, including dark mode, responsive design, and smooth animations. You'll learn how to structure your components, manage state effectively, and create a professional-looking portfolio that stands out.",
    cover_image: "/images/blog3.jpg",
    published_at: "2024-03-01",
    status: "published",
    author: "Marchetti",
    created_at: "2024-03-01",
    updated_at: "2024-03-01"
  }
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    blog_post_id: 1,
    author: "John Doe",
    email: "john@example.com",
    content: "Great article! Really helped me understand TypeScript better.",
    is_approved: true,
    created_at: "2024-01-16",
    updated_at: "2024-01-16"
  },
  {
    id: 2,
    blog_post_id: 1,
    author: "Jane Smith",
    email: "jane@example.com",
    content: "Thanks for this comprehensive guide. Looking forward to more content!",
    is_approved: true,
    created_at: "2024-01-17",
    updated_at: "2024-01-17"
  }
];

export function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Try to load from API
        const postResponse = await getBlogPostBySlug(slug);
        setPost(postResponse.data);
        
        // Load comments for this post
        try {
          const commentsResponse = await getCommentsByPost(postResponse.data.id);
          setComments(commentsResponse.data);
        } catch (commentsErr) {
          // Fallback to mock comments
          const mockCommentsForPost = MOCK_COMMENTS.filter(
            (c) => c.blog_post_id === postResponse.data.id
          );
          setComments(mockCommentsForPost);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to load blog post:', err);
        // Fallback to mock data
        const mockPost = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
        if (mockPost) {
          setPost(mockPost);
          const mockCommentsForPost = MOCK_COMMENTS.filter(
            (c) => c.blog_post_id === mockPost.id
          );
          setComments(mockCommentsForPost);
          setError('Using mock data (Blog API not ready yet)');
        } else {
          setPost(null);
          setError('Post not found');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  // Handle new comment submission
  const handleCommentSubmit = (newComment: Comment) => {
    setComments((prev) => [...prev, newComment]);
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-500 dark:text-slate-400">Loading post...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20">
        <EmptyState
          title="Post not found"
          description="This post may have been removed or the link is incorrect."
        />
        <Link to={ROUTES.blog} className="mt-6 inline-block">
          <Button variant="outline">Back to journal</Button>
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      {error && (
        <div className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
          ⚠️ {error}
        </div>
      )}

      <Link
        to={ROUTES.blog}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to journal
      </Link>

      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {formatDate(post.published_at || post.created_at)}
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
        {post.title}
      </h1>

      <div className="mt-8 space-y-4">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-slate-600 dark:text-slate-300">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Comments ({comments.length})
        </h2>

        <div className="mt-6">
          <CommentList comments={comments} />
        </div>

        <div className="mt-10">
          <CommentForm
            blogPostId={post.id}
            onSubmit={handleCommentSubmit}
          />
        </div>
      </div>
    </article>
  );
}