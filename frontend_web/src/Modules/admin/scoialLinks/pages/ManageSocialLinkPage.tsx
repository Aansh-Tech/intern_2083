import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/common/components/Button";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "@/Modules/admin/components/AdminModal";
import { adminSocialLinksService } from "../services/adminSocialLinks.service";
import type { SocialLink } from "@/types/socialLink.types";

const emptyForm: Partial<SocialLink> = { platform: "", url: "" };
const FIELD_CLASS = "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export function ManageSocialLinksPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<SocialLink>>(emptyForm);

  async function loadLinks() {
    setLoading(true);
    setLinks(await adminSocialLinksService.getAll());
    setLoading(false);
  }

  useEffect(() => { loadLinks(); }, []);

  function openAddModal() { setEditingId(null); setForm(emptyForm); setModalOpen(true); }
  function openEditModal(link: SocialLink) { setEditingId(link.id); setForm(link); setModalOpen(true); }

  async function handleSave() {
    if (editingId) await adminSocialLinksService.update(editingId, form);
    else await adminSocialLinksService.create(form);
    setModalOpen(false);
    loadLinks();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this link?")) return;
    await adminSocialLinksService.remove(id);
    loadLinks();
  }

  const filteredLinks = links.filter((l) =>
    String(l.platform ?? "").toLowerCase().includes(query) ||
    String(l.url ?? "").toLowerCase().includes(query)
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Social Links</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Links shown in your footer and About page.</p>
        </div>
        <Button onClick={openAddModal}><Plus className="h-4 w-4" />Add link</Button>
      </div>
      <div className="mt-6">
        {loading ? <p className="text-slate-500">Loading…</p> : (
          <AdminTable rows={filteredLinks} keyExtractor={(l) => l.id} emptyMessage="No social links yet."
  columns={[
    { header: "Platform", accessor: (l) => l.platform },
    { header: "URL", accessor: (l) => l.url },
    { header: "Actions", accessor: (l) => (
                <div className="flex gap-3">
                  <button onClick={() => openEditModal(l)} aria-label="Edit"><Pencil className="h-4 w-4 text-slate-500 hover:text-indigo-600" /></button>
                  <button onClick={() => handleDelete(l.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" /></button>
                </div>
              )},
            ]}
          />
        )}
      </div>
      <AdminModal open={modalOpen} title={editingId ? "Edit link" : "Add link"} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Platform</label>
            <input placeholder="e.g. GitHub" value={form.platform ?? ""} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>URL</label>
            <input placeholder="https://..." value={form.url ?? ""} onChange={(e) => setForm({ ...form, url: e.target.value })} className={FIELD_CLASS} />
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