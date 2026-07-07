import { BlogCard } from "../components/BlogCard";
import { EmptyState } from "../../../common/components/EmptyState";

// TODO: once the API is ready, replace mockBlogPosts with:
// const { data: posts } = useQuery(["blogPosts"], blogService.getAll);

export function BlogListPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Journal
      </h1>
      <p className="mt-2 max-w-lg text-slate-500 dark:text-slate-400">
        Writing on design, engineering, and building calm software.
      </p>

      {mockBlogPosts.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No posts published yet" />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {mockBlogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
