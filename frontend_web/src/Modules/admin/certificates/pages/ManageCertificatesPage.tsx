import { useEffect, useState, type FormEvent } from "react";
import { AdminTable } from "../../components/AdminTable";
import { AdminModal } from "../../components/AdminModal";
import { Button } from "@/common/components/Button";
import { adminCertificatesService, type CertificatePayload } from "../services/adminCertificates.service";
import { adminSkillsService } from "../../skills/services/adminSkills.service";
import type { Certificate } from "@/types/certificate.types";
import type { Skill } from "@/types/skill.types";

const EMPTY_FORM: CertificatePayload = { title: "", issuer: "" };

export function ManageCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CertificatePayload>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const [certsData, skillsData] = await Promise.all([
        adminCertificatesService.getAll(),
        adminSkillsService.getAll(),
      ]);
      setCertificates(certsData);
      setSkills(skillsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load certificates.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  }

  function openEditModal(cert: Certificate) {
    setEditingId(cert.id);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      skill_id: cert.skill_id,
      issue_date: cert.issue_date,
      expiry_date: cert.expiry_date,
      credential_url: cert.credential_url,
      image: cert.image,
      description: cert.description,
      display_order: cert.display_order,
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  async function handleDelete(cert: Certificate) {
    if (!confirm(`Delete "${cert.title}"?`)) return;
    try {
      await adminCertificatesService.delete(cert.id);
      setCertificates((prev) => prev.filter((c) => c.id !== cert.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete certificate.");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        const updated = await adminCertificatesService.update(editingId, form);
        setCertificates((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      } else {
        const created = await adminCertificatesService.create(form);
        setCertificates((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save certificate.");
    } finally {
      setIsSaving(false);
    }
  }

  function skillName(skillId?: number) {
    if (!skillId) return "—";
    return skills.find((s) => Number(s.id) === skillId)?.name ?? "—";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certificates</h1>
          <p className="text-muted-foreground mt-1">Manage certificates shown on your About page.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>Add certificate</Button>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <AdminTable
        columns={[
          { header: "Title", accessor: (c) => c.title },
          { header: "Issuer", accessor: (c) => c.issuer },
          { header: "Linked skill", accessor: (c) => skillName(c.skill_id) },
          { header: "Issued", accessor: (c) => c.issue_date ?? "—" },
        ]}
        rows={certificates}
        keyExtractor={(c) => c.id}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="No certificates yet — add your first one."
      />

      <AdminModal title={editingId ? "Edit certificate" : "Add certificate"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" required />
          <input type="text" placeholder="Issuer" value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" required />

          <select value={form.skill_id ?? ""}
            onChange={(e) => setForm({ ...form, skill_id: e.target.value ? Number(e.target.value) : undefined })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground">
            <option value="">No linked skill</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>{skill.name}</option>
            ))}
          </select>

          <input type="date" value={form.issue_date ?? ""}
            onChange={(e) => setForm({ ...form, issue_date: e.target.value || undefined })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" />
          <input type="date" value={form.expiry_date ?? ""}
            onChange={(e) => setForm({ ...form, expiry_date: e.target.value || undefined })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" />
          <input type="url" placeholder="Credential URL" value={form.credential_url ?? ""}
            onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" />
          <textarea placeholder="Description" value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground" />

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create certificate"}
          </Button>
        </form>
      </AdminModal>
    </div>
  );
}