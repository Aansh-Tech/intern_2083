import type { BlogPost } from "../../../types/blogPost.types";
import { BlogCard } from "../../blog/components/BlogCard";
import { EmptyState } from "../../../common/components/EmptyState";

interface LatestBlogPostsProps {
  posts: BlogPost[];
}

export function LatestBlogPosts({ posts }: LatestBlogPostsProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        From the journal
      </h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Recent thoughts on design and engineering.
      </p>

      {posts.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No posts published yet"
            description="Publish a blog post from the admin dashboard to show it here."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}