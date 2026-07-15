import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "../../components/AdminModal";
import { Button } from "@/common/components/Button";
import { getErrorMessage } from "@/common/utils/getErrorMessage";
import { adminBlogPostsService } from "../services/adminBlogPost.service";
import { uploadImage } from "@/common/utils/uploadImage";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";
import type { BlogPost } from "@/types/blogPost.types";

const EMPTY_FORM: Partial<BlogPost> = { title: "", slug: "", content: "", status: "draft", allow_comments: true };
const FIELD_CLASS = "rounded-md border border-border bg-background px-3 py-2 text-foreground";
const LABEL_CLASS = "mb-1 block text-sm font-medium text-foreground";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ManageBlogPostsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

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
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setTagsInput("");
    setFormError(null);
    setImageError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  }

  function openEditModal(post: BlogPost) {
    setEditingId(post.id);
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      status: post.status,
      published_at: post.published_at,
      allow_comments: post.allow_comments,
    });
    setTagsInput(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    setFormError(null);
    setImageError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
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

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    const slug = form.slug?.trim() ? form.slug : generateSlug(form.title ?? "");
    const payload: Partial<BlogPost> = {
      ...form,
      slug,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      let postId = editingId;

      if (editingId) {
        const updated = await adminBlogPostsService.update(editingId, payload);
        setPosts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        setEditingPost(updated);
      } else {
        const created = await adminBlogPostsService.create(payload);
        setPosts((prev) => [created, ...prev]);
        setEditingId(created.id);
        setEditingPost(created);
        postId = created.id;
      }

      if (selectedFile && postId) {
        setUploadingImage(true);
        try {
          await uploadImage({
            file: selectedFile,
            imageableType: "blog_post",
            imageableId: postId,
            type: "featured",
            isPrimary: true,
          });
          const refreshed = await adminBlogPostsService.getOne(postId);
          setEditingPost(refreshed);
          setPosts((prev) => prev.map((p) => (p.id === postId ? refreshed : p)));
          setSelectedFile(null);
          setPreviewUrl(null);
          setIsModalOpen(false);
        } catch (err) {
          setImageError(getErrorMessage(err, "Image upload failed."));
        } finally {
          setUploadingImage(false);
        }
      } else {
        setIsModalOpen(false);
      }
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

  const currentImage = editingPost?.images?.find((img) => img.is_primary) ?? editingPost?.images?.[0];
  const currentImageSrc = resolveMediaUrl(currentImage?.image?.url);
  const displayImageSrc = previewUrl ?? currentImageSrc ?? null;

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
        <form id="blog-post-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={LABEL_CLASS}>Title</label>
            <input type="text" placeholder="Post title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full ${FIELD_CLASS}`} required />
          </div>

          <div>
            <label className={LABEL_CLASS}>Excerpt</label>
            <textarea placeholder="Short summary (optional)" value={form.excerpt ?? ""}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className={`w-full ${FIELD_CLASS}`} />
          </div>

          <div>
            <label className={LABEL_CLASS}>Content</label>
            <textarea placeholder="Write your post..." value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              className={`w-full ${FIELD_CLASS}`} required />
          </div>

          <div>
            <label className={LABEL_CLASS}>Category</label>
            <input type="text" placeholder="e.g. Engineering (optional)" value={form.category ?? ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={`w-full ${FIELD_CLASS}`} />
          </div>

          <div>
            <label className={LABEL_CLASS}>Tags</label>
            <input type="text" placeholder="Comma-separated (optional)" value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={`w-full ${FIELD_CLASS}`} />
          </div>

          <div>
            <label className={LABEL_CLASS}>Status</label>
            <select value={form.status ?? "draft"}
              onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" | "archived" })}
              className={`w-full ${FIELD_CLASS}`}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS}>Published at</label>
            <input type="datetime-local" value={form.published_at ?? ""}
              onChange={(e) => setForm({ ...form, published_at: e.target.value || undefined })}
              className={`w-full ${FIELD_CLASS}`} />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.allow_comments ?? true}
              onChange={(e) => setForm({ ...form, allow_comments: e.target.checked })} />
            Allow comments
          </label>

          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </form>

        <div className="mt-5 border-t border-border pt-4">
          <label className={LABEL_CLASS}>Featured image</label>

          {displayImageSrc && (
            <img src={displayImageSrc} alt="Featured" className="mb-2 h-40 w-full rounded-md object-cover" />
          )}

          <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-background/50">
            {uploadingImage ? "Uploading…" : displayImageSrc ? "Replace image" : "Choose image"}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>
          {imageError && <p className="mt-1 text-xs text-red-500">{imageError}</p>}
          {selectedFile && (
            <p className="mt-1 text-xs text-muted-foreground">Image will be uploaded when you save.</p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="blog-post-form" variant="primary" disabled={isSaving || uploadingImage}>
            {isSaving || uploadingImage ? "Saving..." : editingId ? "Save changes" : "Create post"}
          </Button>
        </div>
      </AdminModal>
    </div>
  );
}