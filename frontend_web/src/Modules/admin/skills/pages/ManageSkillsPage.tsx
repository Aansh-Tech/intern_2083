import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/common/components/Button";
import { AdminTable } from "../../components/AdminTable";
import { AdminModal } from "../../components/AdminModal";
import { adminSkillsService } from "../services/adminSkills.service";
import type { Skill } from "@/types/skill.types";

const emptyForm: Partial<Skill> = { name: "", category: "", percentage: 0 };

const FIELD_CLASS =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export function ManageSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Skill>>(emptyForm);

  async function loadSkills() {
    setLoading(true);
    const data = await adminSkillsService.getAll();
    setSkills(data);
    setLoading(false);
  }

  useEffect(() => {
    loadSkills();
  }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(skill: Skill) {
    setEditingId(skill.id);
    setForm(skill);
    setModalOpen(true);
  }

  async function handleSave() {
    if (editingId) {
      await adminSkillsService.update(editingId, form);
    } else {
      await adminSkillsService.create(form);
    }
    setModalOpen(false);
    loadSkills();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return;
    await adminSkillsService.remove(id);
    loadSkills();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage skills shown on your Home and About pages.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add skill
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <AdminTable
            data={skills}
            keyExtractor={(s) => s.id}
            emptyMessage="No skills added yet."
            columns={[
              { header: "Name", render: (s) => s.name },
              { header: "Category", render: (s) => s.category ?? "—" },
              { header: "Level", render: (s) => (s.percentage != null ? `${s.percentage}%` : "—") },
              {
                header: "Actions",
                render: (s) => (
                  <div className="flex gap-3">
                    <button onClick={() => openEditModal(s)} aria-label="Edit">
                      <Pencil className="h-4 w-4 text-slate-500 hover:text-indigo-600" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} aria-label="Delete">
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
        title={editingId ? "Edit skill" : "Add skill"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Skill name</label>
            <input
              placeholder="e.g. Next.js"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Category</label>
            <input
              placeholder="e.g. Framework"
              value={form.category ?? ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Level (0-100)</label>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="85"
              value={form.percentage ?? ""}
              onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Icon / photo</label>
            <input type="file" accept="image/*" className={FIELD_CLASS} />
            <p className="mt-1 text-xs text-slate-400">
              Upload isn't wired to the backend yet -- ask your backend friend
              if /v1/skills accepts multipart file uploads for `photo`.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}