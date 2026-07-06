import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../common/components/Button";
import { EmptyState } from "../../../common/components/EmptyState";
import { formatDate } from "../../../common/utils/formatDate";
import { ROUTES } from "../../../common/constants/routes";
import { CommentList } from "../components/CommentList";
import { CommentForm } from "../components/CommentForm";
import { mockBlogPosts, mockComments } from "../mock/blog.mock";
import type { Comment } from "../../../types/comment.types";

// TODO: once the API is ready, replace this with:
// const { data: post } = useQuery(["blogPosts", slug], () => blogService.getBySlug(slug));
// const { data: comments } = useQuery(["comments", post.id], () => commentsService.getByPost(post.id));

export function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = mockBlogPosts.find((p) => p.slug === slug);
  const [comments, setComments] = useState<Comment[]>(
    mockComments.filter((c) => c.blogPostId === post?.id)
  );

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
      <Link
        to={ROUTES.blog}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to journal
      </Link>

      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {formatDate(post.publishedAt)}
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
            onSubmit={(comment) => setComments((prev) => [...prev, comment])}
          />
        </div>
      </div>
    </article>
  );
}
