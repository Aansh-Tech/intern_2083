import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminTable } from "../../components/AdminTable";
import { AdminModal } from "../../components/AdminModal";
import { Button } from "@/common/components/Button";
import { adminCertificatesService, type CertificatePayload } from "../services/adminCertificates.service";
import { adminSkillsService } from "../../skills/services/adminSkills.service";
import { uploadImage } from "@/common/utils/uploadImage";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";
import type { Certificate } from "@/types/certificate.types";
import type { Skill } from "@/types/skill.types";

const EMPTY_FORM: CertificatePayload = { title: "", issuer: "" };
const FIELD_CLASS = "w-full rounded-md border border-border bg-background px-3 py-2 text-foreground";
const LABEL_CLASS = "mb-1 block text-sm font-medium text-foreground";

export function ManageCertificatesPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [form, setForm] = useState<CertificatePayload>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

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
    setEditingCert(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setImageError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  }

  function openEditModal(cert: Certificate) {
    setEditingId(cert.id);
    setEditingCert(cert);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      skill_id: cert.skill_id,
      issue_date: cert.issue_date,
      expiry_date: cert.expiry_date,
      description: cert.description,
      display_order: cert.display_order,
    });
    setFormError(null);
    setImageError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
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
    try {
      let certId = editingId;

      if (editingId) {
        const updated = await adminCertificatesService.update(editingId, form);
        setCertificates((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        setEditingCert(updated);
      } else {
        const created = await adminCertificatesService.create(form);
        setCertificates((prev) => [...prev, created]);
        setEditingId(created.id);
        setEditingCert(created);
        certId = created.id;
      }

      if (selectedFile && certId) {
        setUploadingImage(true);
        try {
          await uploadImage({
            file: selectedFile,
            imageableType: "certificate",
            imageableId: certId,
            type: "certificate",
            isPrimary: true,
          });
          const refreshed = await adminCertificatesService.getOne(certId);
          setEditingCert(refreshed);
          setCertificates((prev) => prev.map((c) => (c.id === certId ? refreshed : c)));
          setSelectedFile(null);
          setPreviewUrl(null);
          setIsModalOpen(false);
        } catch (err) {
          setImageError(err instanceof Error ? err.message : "Image upload failed.");
        } finally {
          setUploadingImage(false);
        }
      } else {
        setIsModalOpen(false);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save certificate.");
    } finally {
      setIsSaving(false);
    }
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

  function skillName(skillId?: number) {
    if (!skillId) return "—";
    return skills.find((s) => Number(s.id) === skillId)?.name ?? "—";
  }

  const filteredCertificates = certificates.filter((c) =>
    String(c.title ?? "").toLowerCase().includes(query) ||
    String(c.issuer ?? "").toLowerCase().includes(query) ||
    skillName(c.skill_id).toLowerCase().includes(query)
  );

  const currentImage = editingCert?.images?.find((img) => img.is_primary) ?? editingCert?.images?.[0];
  const currentImageSrc = resolveMediaUrl(currentImage?.image.url);
  const displayImageSrc = previewUrl ?? currentImageSrc ?? null;

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
        rows={filteredCertificates}
        keyExtractor={(c) => c.id}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="No certificates yet — add your first one."
      />

      <AdminModal title={editingId ? "Edit certificate" : "Add certificate"} open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form id="certificate-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={LABEL_CLASS}>Title</label>
            <input
              type="text"
              placeholder="e.g. AWS Certified Developer"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={FIELD_CLASS}
              required
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Issuer</label>
            <input
              type="text"
              placeholder="e.g. Amazon Web Services"
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              className={FIELD_CLASS}
              required
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Linked skill</label>
            <select
              value={form.skill_id ?? ""}
              onChange={(e) => setForm({ ...form, skill_id: e.target.value ? Number(e.target.value) : undefined })}
              className={FIELD_CLASS}
            >
              <option value="">No linked skill</option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Started date</label>
              <input
                type="date"
                value={form.issue_date ?? ""}
                onChange={(e) => setForm({ ...form, issue_date: e.target.value || undefined })}
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Completed date</label>
              <input
                type="date"
                value={form.expiry_date ?? ""}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value || undefined })}
                className={FIELD_CLASS}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Description</label>
            <textarea
              placeholder="Optional notes about this certificate"
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={FIELD_CLASS}
            />
          </div>

          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </form>

        <div className="mt-5 border-t border-border pt-4">
          <label className={LABEL_CLASS}>Certificate image</label>

          {displayImageSrc && (
            <img src={displayImageSrc} alt="Certificate" className="mb-2 h-32 w-full rounded-md object-cover" />
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
          <Button type="submit" form="certificate-form" variant="primary" disabled={isSaving || uploadingImage}>
            {isSaving || uploadingImage ? "Saving..." : editingId ? "Save changes" : "Create certificate"}
          </Button>
        </div>
      </AdminModal>
    </div>
  );
}