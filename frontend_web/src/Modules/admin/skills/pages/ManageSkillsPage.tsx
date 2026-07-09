import { useEffect, useState, type FormEvent } from "react";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "@/common/components/admin/AdminModal";
import { Button } from "@/common/components/Button";
import { adminSkillsService, type SkillPayload } from "../services/adminSkills.service";
import type { Skill } from "@/types/skill.types";

const EMPTY_FORM: SkillPayload = { name: "", display_order: undefined };

export function ManageSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillPayload>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadSkills() {
    setIsLoading(true);
    setError(null);
    try {
      setSkills(await adminSkillsService.getAll());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load skills.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  }

  function openEditModal(skill: Skill) {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      display_order: skill.display_order,
      proficiency: skill.proficiency,
      category: skill.category,
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  async function handleDelete(skill: Skill) {
    if (!confirm(`Delete "${skill.name}"?`)) return;
    try {
      await adminSkillsService.delete(skill.id);
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete skill.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        const updated = await adminSkillsService.update(editingId, form);
        setSkills((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const created = await adminSkillsService.create(form);
        setSkills((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save skill.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Skills</h1>
          <p className="text-muted-foreground mt-1">Manage your toolkit skills.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          Add skill
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <AdminTable
        columns={[
          { header: "Name", accessor: (s) => s.name },
          { header: "Category", accessor: (s) => s.category ?? "—" },
          { header: "Proficiency", accessor: (s) => (s.proficiency != null ? `${s.proficiency}%` : "—") },
          { header: "Order", accessor: (s) => s.display_order ?? "—" },
        ]}
        rows={skills}
        keyExtractor={(s) => s.id}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="No skills yet — add your first one."
      />

      <AdminModal
        title={editingId ? "Edit skill" : "Add skill"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Skill name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
            required
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={form.category ?? ""}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />
          <input
            type="number"
            placeholder="Proficiency 0-100 (optional)"
            value={form.proficiency ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                proficiency: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />
          <input
            type="number"
            placeholder="Display order (optional)"
            value={form.display_order ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                display_order: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create skill"}
          </Button>
        </form>
      </AdminModal>
    </div>
  );
}