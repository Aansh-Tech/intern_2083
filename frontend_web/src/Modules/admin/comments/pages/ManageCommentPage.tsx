import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../../common/components/Badge";
import { AdminTable } from "../../components/AdminTable";
import { adminCommentsService } from "../service/adminComment.service";
import { adminBlogPostsService } from "../../blog/services/adminBlogPost.service";
import type { Comment } from "../../../../types/comment.types";
import type { BlogPost } from "../../../../types/blogPost.types";

export function ManageCommentsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminBlogPostsService.getAll().then((data) => {
      setPosts(data);
      if (data.length > 0) setSelectedSlug(data[0].slug);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;
    adminCommentsService.getByPostSlug(selectedSlug).then(setComments);
  }, [selectedSlug]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this comment?")) return;
    await adminCommentsService.remove(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Comments</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Moderate reader comments, by post.
      </p>

      <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
        Note: there's no approve action available yet -- only delete. Ask
        the backend to add an approve/update endpoint if comments need to
        be published after moderation.
      </p>

      {loading ? (
        <p className="mt-6 text-slate-500">Loading…</p>
      ) : (
        <>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="mt-6 rounded-xl border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {posts.map((post) => (
              <option key={post.id} value={post.slug}>
                {post.title}
              </option>
            ))}
          </select>

          <div className="mt-6">
            <AdminTable
              data={comments}
              keyExtractor={(c) => String(c.id)}
              emptyMessage="No comments on this post yet."
              columns={[
                { header: "Name", render: (c) => c.name },
                { header: "Comment", render: (c) => c.content },
                {
                  header: "Status",
                  render: (c) => (
                    <Badge tone={c.status === "approved" ? "green" : "amber"}>
                      {c.status}
                    </Badge>
                  ),
                },
                {
                  header: "Actions",
                  render: (c) => (
                    <button onClick={() => handleDelete(c.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                    </button>
                  ),
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}