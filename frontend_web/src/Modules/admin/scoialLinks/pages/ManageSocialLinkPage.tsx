import { useEffect, useState, type FormEvent } from "react";
import { AdminTable } from "@/common/components/admin/AdminTable";
import { AdminModal } from "@/common/components/admin/AdminModal";
import { Button } from "@/common/components/Button";
import {
  adminSocialLinksService,
  type SocialLinkPayload,
} from "../services/adminSocialLinks.service";
import type { SocialLink } from "@/types/socialLink.types";

const EMPTY_FORM: SocialLinkPayload = { platform: "", url: "", display_order: 0 };

export function ManageSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SocialLinkPayload>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadLinks() {
    setIsLoading(true);
    setError(null);
    try {
      setLinks(await adminSocialLinksService.getAll());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load social links.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  }

  function openEditModal(link: SocialLink) {
    setEditingId(link.id);
    setForm({ platform: link.platform, url: link.url, display_order: link.display_order });
    setFormError(null);
    setIsModalOpen(true);
  }

  async function handleDelete(link: SocialLink) {
    if (!confirm(`Delete "${link.platform}"?`)) return;
    try {
      await adminSocialLinksService.delete(link.id);
      setLinks((prev) => prev.filter((l) => l.id !== link.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete social link.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        const updated = await adminSocialLinksService.update(editingId, form);
        setLinks((prev) => prev.map((l) => (l.id === editingId ? updated : l)));
      } else {
        const created = await adminSocialLinksService.create(form);
        setLinks((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save social link.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Social Links</h1>
          <p className="text-muted-foreground mt-1">Manage links shown on your About page.</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          Add link
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <AdminTable
        columns={[
          { header: "Platform", accessor: (l) => l.platform },
          { header: "URL", accessor: (l) => l.url },
          { header: "Order", accessor: (l) => l.display_order },
        ]}
        rows={links}
        keyExtractor={(l) => l.id}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="No social links yet — add your first one."
      />

      <AdminModal
        title={editingId ? "Edit social link" : "Add social link"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Platform (e.g. GitHub)"
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
            required
          />
          <input
            type="url"
            placeholder="URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
            required
          />
          <input
            type="number"
            placeholder="Display order"
            value={form.display_order}
            onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create link"}
          </Button>
        </form>
      </AdminModal>
    </div>
  );
}