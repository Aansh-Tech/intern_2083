import { useEffect, useState, type FormEvent } from "react";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "@/common/components/admin/AdminModal";
import { Button } from "@/common/components/Button";
import { adminProjectsService, type ProjectPayload } from "../services/adminProjects.services";
import type { Project } from "@/types/project.types";

const EMPTY_FORM: ProjectPayload = {
  title: "",
  slug: "",
  description: "",
  status: "published",
  is_featured: false,
  github_link: "",
  live_link: "",
};

export function ManageProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectPayload>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadProjects() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminProjectsService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      status: project.status,
      is_featured: project.is_featured,
      github_link: project.github_link ?? "",
      live_link: project.live_link ?? "",
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  async function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    try {
      await adminProjectsService.delete(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingId) {
        const updated = await adminProjectsService.update(editingId, form);
        setProjects((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await adminProjectsService.create(form);
        setProjects((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          Add project
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <AdminTable
        columns={[
          { header: "Title", accessor: (p) => p.title },
          { header: "Status", accessor: (p) => p.status },
          { header: "Featured", accessor: (p) => (p.is_featured ? "Yes" : "No") },
        ]}
        rows={projects}
        keyExtractor={(p) => p.id}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="No projects yet — add your first one."
      />

      <AdminModal
        title={editingId ? "Edit project" : "Add project"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
            required
          />
          <input
            type="text"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
            required
          />
          <input
            type="text"
            placeholder="Status (e.g. published, draft)"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />
          <input
            type="url"
            placeholder="GitHub link"
            value={form.github_link}
            onChange={(e) => setForm({ ...form, github_link: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />
          <input
            type="url"
            placeholder="Live demo link"
            value={form.live_link}
            onChange={(e) => setForm({ ...form, live_link: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            Featured
          </label>

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create project"}
          </Button>
        </form>
      </AdminModal>
    </div>
  );
}