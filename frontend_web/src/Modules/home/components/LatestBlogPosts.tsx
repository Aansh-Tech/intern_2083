import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import { BlogCard } from "@/Modules/blog/components/BlogCard";
import type { BlogPost } from "@/types/blogPost.types";

interface LatestBlogPostsProps {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
}

export function LatestBlogPosts({ posts, isLoading, error }: LatestBlogPostsProps) {
  if (isLoading) return <Loader />;

  if (error) {
    return (
      <EmptyState
        title="Blog coming soon"
        description="Posts will appear here once the blog backend is live."
      />
    );
  }

  if (posts.length === 0) {
    return <EmptyState title="No posts yet" description="Check back soon." />;
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
        Latest from the blog
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}