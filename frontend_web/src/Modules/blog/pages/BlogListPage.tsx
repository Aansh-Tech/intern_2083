// modules/blog/pages/BlogListPage.tsx

import { useEffect, useState } from "react";
import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import { BlogCard } from "../components/BlogCard";
import { blogService } from "../services/blog.service";
import type { BlogPost } from "@/types/blogPost.types";

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    blogService
      .getAll()
      .then((data) => {
        if (isMounted) setPosts(data);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load posts.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Blog</h1>

      {isLoading && <Loader />}

      {/* Expected right now — BlogPostController is empty on the backend */}
      {error && (
        <EmptyState
          title="Blog coming soon"
          description="Posts will appear here once the backend is live."
        />
      )}

      {!isLoading && !error && posts.length === 0 && (
        <EmptyState title="No posts yet" description="Check back soon." />
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}