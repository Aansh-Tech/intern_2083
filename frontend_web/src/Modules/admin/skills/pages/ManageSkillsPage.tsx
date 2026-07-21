import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/common/components/Button";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "@/Modules/admin/components/AdminModal";
import { adminSkillsService } from "../services/adminSkills.service";
import type { Skill } from "@/types/skill.types";

const emptyForm: Partial<Skill> = { name: "", category: "", proficiency: 0 };
const FIELD_CLASS = "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export function ManageSkillsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Skill>>(emptyForm);

  async function loadSkills() {
    setLoading(true);
    setSkills(await adminSkillsService.getAll());
    setLoading(false);
  }

  useEffect(() => { loadSkills(); }, []);

  function openAddModal() { setEditingId(null); setForm(emptyForm); setModalOpen(true); }
  function openEditModal(skill: Skill) { setEditingId(skill.id); setForm(skill); setModalOpen(true); }

  function handleProficiencyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (value === "") {
      setForm({ ...form, proficiency: undefined });
      return;
    }

    if (!/^\d+$/.test(value)) return;

    const num = Number(value);
    if (num >= 0 && num <= 100) {
      setForm({ ...form, proficiency: num });
    }
  }

  async function handleSave() {
    const proficiency = form.proficiency;
    if (proficiency == null || proficiency < 0 || proficiency > 100) {
      alert("Proficiency must be between 0 and 100.");
      return;
    }

    if (editingId) await adminSkillsService.update(editingId, form);
    else await adminSkillsService.create(form);
    setModalOpen(false);
    loadSkills();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this skill?")) return;
    await adminSkillsService.remove(id);
    loadSkills();
  }

  const filteredSkills = skills.filter((s) =>
    s.name.toLowerCase().includes(query) ||
    (s.category ?? "").toLowerCase().includes(query)
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Manage skills shown on your Home and About pages.</p>
        </div>
        <Button onClick={openAddModal}><Plus className="h-4 w-4" />Add skill</Button>
      </div>
      <div className="mt-6">
        {loading ? <p className="text-slate-500">Loading…</p> : (
          <AdminTable rows={filteredSkills} keyExtractor={(s) => s.id} emptyMessage="No skills added yet."
            columns={[
              { header: "Name", accessor: (s) => s.name },
              { header: "Category", accessor: (s) => s.category ?? "—" },
              { header: "Proficiency", accessor: (s) => (s.proficiency != null ? `${s.proficiency}%` : "—") },
              { header: "Actions", accessor: (s) => (
                <div className="flex gap-3">
                  <button onClick={() => openEditModal(s)} aria-label="Edit"><Pencil className="h-4 w-4 text-slate-500 hover:text-indigo-600" /></button>
                  <button onClick={() => handleDelete(s.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" /></button>
                </div>
              )},
            ]}
          />
        )}
      </div>
      <AdminModal open={modalOpen} title={editingId ? "Edit skill" : "Add skill"} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Skill name</label>
            <input placeholder="e.g. Next.js" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Category</label>
            <input placeholder="e.g. Framework" value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Proficiency (0-100)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0–100"
              value={form.proficiency ?? ""}
              onChange={handleProficiencyChange}
              className={FIELD_CLASS}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}