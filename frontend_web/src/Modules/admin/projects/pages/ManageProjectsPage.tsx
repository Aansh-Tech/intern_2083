import { useEffect, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/common/components/Button";
import { Badge } from "@/common/components/Badge";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "@/Modules/admin/components/AdminModal";
import { adminProjectsService } from "../services/adminProjects.services";
import { uploadImage } from "@/common/utils/uploadImage";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";
import { apiClient } from "@/services/apiClient";
import type { Project, ProjectStatus } from "@/types/project.types";

const emptyForm: Partial<Project> = {
  title: "", slug: "", description: "", content: "",
  github_link: "", live_link: "", technologies: "", is_featured: false, status: "draft",
};

const FIELD_CLASS = "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface PendingImage {
  file: File;
  previewUrl: string;
}

export function ManageProjectsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  async function loadProjects() {
    setLoading(true);
    setProjects(await adminProjectsService.getAll());
    setLoading(false);
  }

  useEffect(() => { loadProjects(); }, []);

  function openAddModal() {
    setEditingId(null);
    setEditingProject(null);
    setForm(emptyForm);
    setTechInput("");
    setPendingImages([]);
    setImageError(null);
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingId(project.id);
    setEditingProject(project);
    setForm(project);
    setTechInput(project.technologies ?? "");
    setPendingImages([]);
    setImageError(null);
    setModalOpen(true);
  }

  function handleFilesSelected(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const newPending = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setPendingImages((prev) => [...prev, ...newPending]);
    setImageError(null);
    e.target.value = "";
  }

  function removePendingImage(index: number) {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleDeleteImage(attachmentId: number) {
    if (!editingId) return;
    if (!confirm("Remove this image from the project?")) return;

    setDeletingImageId(attachmentId);
    try {
      const { data } = await apiClient.delete<{ success: boolean; message?: string }>(
        `/v1/images/${attachmentId}`
      );
      if (!data.success) throw new Error(data.message ?? "Failed to delete image");

      const refreshed = await adminProjectsService.getOne(editingId);
      setEditingProject(refreshed);
      setProjects((prev) => prev.map((p) => (p.id === editingId ? refreshed : p)));
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Failed to delete image.");
    } finally {
      setDeletingImageId(null);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const slug = form.slug?.trim() ? form.slug : generateSlug(form.title ?? "");
      const payload: Partial<Project> = {
        ...form,
        slug,
        technologies: techInput,
      };

      let projectId = editingId;
      if (editingId) {
        await adminProjectsService.update(editingId, payload);
      } else {
        const created = await adminProjectsService.create(payload);
        projectId = created.id;
      }

      if (pendingImages.length > 0 && projectId) {
        setUploadingImages(true);
        const existingCount = editingProject?.images?.length ?? 0;
        try {
          for (let i = 0; i < pendingImages.length; i++) {
            await uploadImage({
              file: pendingImages[i].file,
              imageableType: "project",
              imageableId: projectId,
              type: "gallery",
              isPrimary: existingCount === 0 && i === 0,
            });
          }
        } catch (err) {
          setImageError(err instanceof Error ? err.message : "Some images failed to upload.");
        } finally {
          setUploadingImages(false);
        }
      }

      setModalOpen(false);
      loadProjects();
    } catch (err) {
      console.error("Failed to save project:", err);
      alert(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await adminProjectsService.remove(id);
    loadProjects();
  }

  const filteredProjects = projects.filter((p) => {
    return (
      String(p.title ?? "").toLowerCase().includes(query) ||
      String(p.technologies ?? "").toLowerCase().includes(query) ||
      String(p.status ?? "").toLowerCase().includes(query)
    );
  });

  const existingImages = editingProject?.images ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openAddModal}><Plus className="h-4 w-4" />Add project</Button>
      </div>

      <div className="mt-6">
        {loading ? <p className="text-slate-500">Loading…</p> : (
          <AdminTable rows={filteredProjects} keyExtractor={(p) => p.id} emptyMessage="No projects yet."
            columns={[
              { header: "Title", accessor: (p) => p.title },
              { header: "Status", accessor: (p) => (
                <Badge tone={p.status === "published" ? "green" : p.status === "archived" ? "slate" : "amber"}>{p.status}</Badge>
              )},
              { header: "Featured", accessor: (p) => (p.is_featured ? "Yes" : "No") },
              { header: "Actions", accessor: (p) => (
                <div className="flex gap-3">
                  <button onClick={() => openEditModal(p)} aria-label="Edit"><Pencil className="h-4 w-4 text-slate-500 hover:text-indigo-600" /></button>
                  <button onClick={() => handleDelete(p.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" /></button>
                </div>
              )},
            ]}
          />
        )}
      </div>

      <AdminModal open={modalOpen} title={editingId ? "Edit project" : "Add project"} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Title</label>
            <input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Short description</label>
            <textarea rows={2} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Full content</label>
            <textarea rows={5} value={form.content ?? ""} onChange={(e) => setForm({ ...form, content: e.target.value })} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Technologies (comma-separated)</label>
            <input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, TypeScript, Tailwind" className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Status</label>
            <select value={form.status ?? "draft"} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })} className={FIELD_CLASS}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>GitHub link</label>
            <input value={form.github_link ?? ""} onChange={(e) => setForm({ ...form, github_link: e.target.value })} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Live demo link</label>
            <input value={form.live_link ?? ""} onChange={(e) => setForm({ ...form, live_link: e.target.value })} className={FIELD_CLASS} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={form.is_featured ?? false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            Featured on homepage
          </label>

          <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <label className={LABEL_CLASS}>Project images</label>

            {existingImages.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2">
                {existingImages.map((img) => {
                  const src = resolveMediaUrl(img.image?.url);
                  return src ? (
                    <div key={img.id} className="group relative">
                      <img src={src} alt="" className="h-20 w-full rounded-lg object-cover" />
                      {img.is_primary && (
                        <span className="absolute left-1 top-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={deletingImageId === img.id}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 disabled:opacity-50"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {pendingImages.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2">
                {pendingImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img.previewUrl} alt="" className="h-20 w-full rounded-lg object-cover opacity-70" />
                    <button
                      type="button"
                      onClick={() => removePendingImage(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
              {uploadingImages ? "Uploading…" : "Add images"}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFilesSelected}
                disabled={uploadingImages}
                className="hidden"
              />
            </label>
            {imageError && <p className="mt-1 text-xs text-red-500">{imageError}</p>}
            {pendingImages.length > 0 && (
              <p className="mt-1 text-xs text-slate-400">
                {pendingImages.length} image{pendingImages.length === 1 ? "" : "s"} will upload when you save.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || uploadingImages}>
              {isSaving || uploadingImages ? "Saving..." : "Save project"}
            </Button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}