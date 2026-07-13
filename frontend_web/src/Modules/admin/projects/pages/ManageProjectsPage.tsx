import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/common/components/Button";
import { Badge } from "@/common/components/Badge";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "@/Modules/admin/components/AdminModal";
import { adminProjectsService } from "../services/adminProjects.services";
import type { Project, ProjectStatus } from "@/types/project.types";

const emptyForm: Partial<Project> = {
  title: "", slug: "", subtitle: "", description: "", content: "",
  github_link: "", live_link: "", technologies: [], is_featured: false, status: "draft",
};

const FIELD_CLASS = "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export function ManageProjectsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Project>>(emptyForm);
  const [techInput, setTechInput] = useState("");

  async function loadProjects() {
    setLoading(true);
    setProjects(await adminProjectsService.getAll());
    setLoading(false);
  }

  useEffect(() => { loadProjects(); }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setTechInput("");
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingId(project.id);
    setForm(project);
    setTechInput((Array.isArray(project.technologies) ? project.technologies : []).join(", "));
    setModalOpen(true);
  }

  async function handleSave() {
    const payload: Partial<Project> = {
      ...form,
      technologies: techInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editingId) await adminProjectsService.update(editingId, payload);
    else await adminProjectsService.create(payload);
    setModalOpen(false);
    loadProjects();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await adminProjectsService.remove(id);
    loadProjects();
  }

  const filteredProjects = projects.filter((p) => {
    const techArray = Array.isArray(p.technologies) ? p.technologies : [];
    return (
      String(p.title ?? "").toLowerCase().includes(query) ||
      techArray.some((t) => String(t).toLowerCase().includes(query)) ||
      String(p.status ?? "").toLowerCase().includes(query)
    );
  });

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
            <label className={LABEL_CLASS}>Slug</label>
            <input value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Subtitle</label>
            <input value={form.subtitle ?? ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={FIELD_CLASS} />
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
          <div>
            <label className={LABEL_CLASS}>Completed date</label>
            <input type="date" value={form.completed_at ?? ""} onChange={(e) => setForm({ ...form, completed_at: e.target.value })} className={FIELD_CLASS} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={form.is_featured ?? false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            Featured on homepage
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save project</Button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}