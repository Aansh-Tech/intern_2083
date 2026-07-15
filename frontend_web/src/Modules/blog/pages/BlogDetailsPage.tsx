// modules/blog/pages/BlogDetailsPage.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import { formatDate } from "@/common/utils/formatDate";
import { CommentList } from "../components/CommentList";
import { CommentForm } from "../components/CommentForm";
import { blogService } from "../services/blog.service";
import { commentsService } from "../services/comments.service";
import type { BlogPost } from "@/types/blogPost.types";
import type { Comment } from "@/types/comment.types";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";
export function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const featuredImage = post?.images?.find((img) => img.is_primary) ?? post?.images?.[0];
  const featuredImageSrc = resolveMediaUrl(featuredImage?.image?.url);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    Promise.all([blogService.getBySlug(slug), commentsService.getByPostSlug(slug)])
      .then(([postData, commentsData]) => {
        if (!isMounted) return;
        setPost(postData);
        setComments(commentsData);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Post not found.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  function handleCommentAdded(newComment: Comment) {
    setComments((prev) => [newComment, ...prev]);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {isLoading && <Loader />}
      {error && <EmptyState title="Couldn't load this post" description={error} />}

      {!isLoading && !error && post && (
          <div className="flex flex-col gap-6">
                  {featuredImageSrc && (
          <img
            src={featuredImageSrc}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-md"
          />
        )}

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {formatDate(post.published_at)}
            </p>
            <h1 className="text-3xl font-semibold text-foreground">{post.title}</h1>
          </div>

          <div className="text-foreground whitespace-pre-line">{post.content}</div>

          <section className="pt-6 border-t border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Comments</h2>
            <CommentList comments={comments} />
            <div className="mt-6">
              <CommentForm postSlug={slug!} onCommentAdded={handleCommentAdded} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}