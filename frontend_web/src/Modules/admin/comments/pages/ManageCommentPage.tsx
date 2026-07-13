import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminTable } from "../../components/AdminTable";
import { getErrorMessage } from "@/common/utils/getErrorMessage";
import { adminCommentsService } from "../service/adminComment.service";
import { adminBlogPostsService } from "../../blog/services/adminBlogPost.service";
import type { Comment } from "@/types/comment.types";
import type { BlogPost } from "@/types/blogPost.types";

export function ManageCommentsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminBlogPostsService.getAll()
      .then(setPosts)
      .catch((err) => setError(getErrorMessage(err, "Failed to load posts.")))
      .finally(() => setIsLoadingPosts(false));
  }, []);

  useEffect(() => {
    if (!selectedSlug) {
      setComments([]);
      return;
    }
    setIsLoadingComments(true);
    setError(null);
    adminCommentsService.getByPostSlug(selectedSlug)
      .then(setComments)
      .catch((err) => setError(getErrorMessage(err, "Failed to load comments.")))
      .finally(() => setIsLoadingComments(false));
  }, [selectedSlug]);

  async function handleDelete(comment: Comment) {
    if (!confirm(`Delete comment from "${comment.name}"?`)) return;
    try {
      await adminCommentsService.remove(comment.id);
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (err) {
      alert(getErrorMessage(err, "Failed to delete comment."));
    }
  }

  const filteredComments = comments.filter((c) =>
    String(c.name ?? "").toLowerCase().includes(query) ||
    String(c.email ?? "").toLowerCase().includes(query) ||
    String(c.content ?? "").toLowerCase().includes(query)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Comments</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Comments can only be viewed per blog post — pick a post below.
      </p>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <select
        value={selectedSlug}
        onChange={(e) => setSelectedSlug(e.target.value)}
        disabled={isLoadingPosts}
        className="rounded-md border border-border bg-background px-3 py-2 text-foreground mb-6"
      >
        <option value="">Select a blog post…</option>
        {posts.map((post) => (
          <option key={post.id} value={post.slug}>{post.title}</option>
        ))}
      </select>

      {selectedSlug && (
        <AdminTable
          columns={[
            { header: "Name", accessor: (c) => c.name },
            { header: "Email", accessor: (c) => c.email },
            { header: "Comment", accessor: (c) => c.content },
            { header: "Status", accessor: (c) => c.status },
          ]}
          rows={filteredComments}
          keyExtractor={(c) => c.id}
          onDelete={handleDelete}
          isLoading={isLoadingComments}
          emptyMessage="No comments on this post yet."
        />
      )}
    </div>
  );
}