import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../../common/components/Button";
import { Badge } from "../../../../common/components/Badge";
import { AdminTable } from "../../components/AdminTable";
import { AdminModal } from "../../components/AdminModal";
import { adminBlogPostsService } from "../services/adminBlogPost.service";
import type { BlogPost } from "../../../../types/blogPost.types";

const emptyForm: Partial<BlogPost> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
  allow_comments: true,
};

export function ManageBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>(emptyForm);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await adminBlogPostsService.getAll();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(post: BlogPost) {
    setEditingId(post.id);
    setForm(post);
    setModalOpen(true);
  }

  async function handleSave() {
    if (editingId) {
      await adminBlogPostsService.update(editingId, form);
    } else {
      await adminBlogPostsService.create(form);
    }
    setModalOpen(false);
    loadPosts();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    await adminBlogPostsService.remove(id);
    loadPosts();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage your blog content.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Post
        </Button>
      </div>

      <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
        Note: only published posts appear below -- there's currently no
        endpoint to list drafts. Newly created drafts won't show here until
        the backend adds an admin list endpoint.
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <AdminTable
            data={posts}
            keyExtractor={(p) => String(p.id)}
            emptyMessage="No published posts yet."
            columns={[
              { header: "Title", render: (p) => p.title },
              {
                header: "Status",
                render: (p) => (
                  <Badge tone={p.status === "published" ? "green" : "amber"}>
                    {p.status}
                  </Badge>
                ),
              },
              {
                header: "Actions",
                render: (p) => (
                  <div className="flex gap-3">
                    <button onClick={() => openEditModal(p)} aria-label="Edit">
                      <Pencil className="h-4 w-4 text-slate-500 hover:text-indigo-600" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      <AdminModal
        open={modalOpen}
        title={editingId ? "Edit Post" : "Add Post"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <input
            placeholder="Title"
            value={form.title ?? ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <input
            placeholder="Slug (optional -- auto-generated if blank)"
            value={form.slug ?? ""}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <textarea
            placeholder="Excerpt"
            value={form.excerpt ?? ""}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <textarea
            placeholder="Content"
            rows={6}
            value={form.content ?? ""}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <select
            value={form.status ?? "draft"}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as BlogPost["status"] })
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <Button onClick={handleSave} className="w-full">
            {editingId ? "Save Changes" : "Add Post"}
          </Button>
        </div>
      </AdminModal>
    </div>
  );
}