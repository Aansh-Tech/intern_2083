import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, X, Trash2 } from "lucide-react";
import { AdminTable } from "../../components/AdminTable";
import { Badge } from "@/common/components/Badge";
import { formatDate } from "@/common/utils/formatDate";
import { getErrorMessage } from "@/common/utils/getErrorMessage";
import { adminCommentsService } from "../service/adminComment.service";
import type { Comment } from "@/types/comment.types";

// The /v1/comments response may nest the related post under different
// keys depending on how the backend resource is shaped. This helper
// checks the common possibilities so the column doesn't break if the
// exact shape differs from what we expect.
function getPostTitle(comment: Comment): string {
  const c = comment as any;
  return (
    c.blog_post?.title ??
    c.post?.title ??
    c.post_title ??
    (c.blog_post_id ? `Post #${c.blog_post_id}` : "—")
  );
}

const STATUS_TONE: Record<Comment["status"], "green" | "amber" | "slate"> = {
  approved: "green",
  pending: "amber",
  rejected: "slate",
};

export function ManageCommentsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function loadComments() {
    setIsLoading(true);
    setError(null);
    try {
      setComments(await adminCommentsService.getAll());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load comments."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, []);

  async function handleStatusChange(comment: Comment, status: Comment["status"]) {
    setUpdatingId(comment.id);
    try {
      const updated = await adminCommentsService.updateStatus(comment.id, status);
      setComments((prev) => prev.map((c) => (c.id === comment.id ? updated : c)));
    } catch (err) {
      alert(getErrorMessage(err, "Failed to update comment status."));
    } finally {
      setUpdatingId(null);
    }
  }

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
    String(c.content ?? "").toLowerCase().includes(query) ||
    getPostTitle(c).toLowerCase().includes(query)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Comments</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        All comments across every post. Approve, reject, or delete as needed.
      </p>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <AdminTable
        columns={[
          { header: "Name", accessor: (c) => c.name },
          { header: "Email", accessor: (c) => c.email },
          { header: "Post", accessor: (c) => getPostTitle(c) },
          { header: "Comment", accessor: (c) => c.content },
          { header: "Status", accessor: (c) => <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge> },
          { header: "Date", accessor: (c) => (c.created_at ? formatDate(c.created_at) : "—") },
          {
            header: "Actions",
            accessor: (c) => (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStatusChange(c, "approved")}
                  disabled={updatingId === c.id || c.status === "approved"}
                  aria-label="Approve"
                  className="text-slate-500 hover:text-green-600 disabled:opacity-30"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleStatusChange(c, "rejected")}
                  disabled={updatingId === c.id || c.status === "rejected"}
                  aria-label="Reject"
                  className="text-slate-500 hover:text-amber-600 disabled:opacity-30"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  aria-label="Delete"
                  className="text-slate-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
        rows={filteredComments}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        emptyMessage="No comments yet."
      />
    </div>
  );
}