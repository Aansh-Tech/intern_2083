import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "../../components/AdminModal";
import { Button } from "@/common/components/Button";
import { getErrorMessage } from "@/common/utils/getErrorMessage";
import { adminBlogPostsService } from "../services/adminBlogPost.service";
import type { BlogPost } from "@/types/blogPost.types";

const EMPTY_FORM: Partial<BlogPost> = { title: "", slug: "", content: "", status: "draft", allow_comments: true };

export function ManageBlogPostsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadPosts() {
    setIsLoading(true);
    setError(null);
    try {
      setPosts(await adminBlogPostsService.getAll());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load blog posts."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTagsInput("");
    setFormError(null);
    setIsModalOpen(true);
  }

  function openEditModal(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image,
      category: post.category,
      status: post.status,
      published_at: post.published_at,
      allow_comments: post.allow_comments,
    });
    setTagsInput(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    setFormError(null);
    setIsModalOpen(true);
  }

  async function handleDelete(post: BlogPost) {
    if (!confirm(`Delete "${post.title}"?`)) return;
    try {
      await adminBlogPostsService.remove(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      alert(getErrorMessage(err, "Failed to delete blog post."));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    const payload: Partial<BlogPost> = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const updated = await adminBlogPostsService.update(editingId, payload);
        setPosts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await adminBlogPostsService.create(payload);
        setPosts((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to save blog post."));
    } finally {
      setIsSaving(false);
    }
  }

  const filteredPosts = posts.filter((p) => {
    const tagsArray = Array.isArray(p.tags) ? p.tags : [];
    return (
      p.title.toLowerCase().includes(query) ||
      (p.category ?? "").toLowerCase().includes(query) ||
      tagsArray.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Manage posts shown on your blog.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>Add post</Button>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <AdminTable
        columns={[
          { header: "Title", accessor: (p) => p.title },
          { header: "Status", accessor: (p) => p.status },
          { header: "Category", accessor: (p) => p.category ?? "—" },
        ]}
        rows={filteredPosts}
        keyExtractor={(p) => p.id}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="No blog posts yet — add your first one."
      />

      <AdminModal title={editingId ? "Edit post" : "Add post"} open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" required />
          <input type="text" placeholder="Slug" value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" required />
          <textarea placeholder="Excerpt (optional)" value={form.excerpt ?? ""}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" />
          <textarea placeholder="Content" value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" required />
          <input type="text" placeholder="Featured image URL (optional)" value={form.featured_image ?? ""}
            onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" />
          <input type="text" placeholder="Category (optional)" value={form.category ?? ""}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" />
          <input type="text" placeholder="Tags, comma-separated (optional)" value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" />
          <select value={form.status ?? "draft"}
            onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" | "archived" })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <input type="datetime-local" value={form.published_at ?? ""}
            onChange={(e) => setForm({ ...form, published_at: e.target.value || undefined })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.allow_comments ?? true}
              onChange={(e) => setForm({ ...form, allow_comments: e.target.checked })} />
            Allow comments
          </label>

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create post"}
          </Button>
        </form>
      </AdminModal>
    </div>
  );
}