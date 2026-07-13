import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/common/components/Button";
import { adminAboutService } from "../services/adminAbout.service";
import { uploadImage, uploadResume, getPrimaryAvatar } from "@/common/utils/uploadImage";
import type { Profile } from "@/types/profile.types";

const FIELD_CLASS =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export function ManageAboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAboutService.getProfile();
      setProfile(data);
      setForm(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await adminAboutService.updateProfile(form);
      setProfile(updated);
      setForm(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingPhoto(true);
    setPhotoError(null);
    try {
      await uploadImage({
        file,
        imageableType: "profile",
        imageableId: profile.id,
        type: "avatar",
        isPrimary: true,
      });
      await loadProfile();
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Photo upload failed.");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  async function handleResumeFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setResumeError("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    setUploadingResume(true);
    setResumeError(null);
    try {
      const result = await uploadResume(file);
      setForm((prev) => ({ ...prev, resume_path: result.resume_path, resume_url: result.resume_url }));
      setProfile((prev) => (prev ? { ...prev, resume_path: result.resume_path, resume_url: result.resume_url } : prev));
    } catch (err) {
      setResumeError(err instanceof Error ? err.message : "Resume upload failed.");
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  }

  if (loading) return <p className="text-slate-500">Loading…</p>;

  const avatar = getPrimaryAvatar(profile?.images);

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage About</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Edit the bio and details shown on your public About page.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}
      {saved && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
          Saved successfully.
        </p>
      )}

      <div className="mt-6 grid max-w-3xl gap-8 sm:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <div className="h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500">
            {avatar && (
              <img src={avatar.image.url} alt="Profile" className="h-full w-full object-cover" />
            )}
          </div>
          <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            {uploadingPhoto ? "Uploading…" : avatar ? "Replace" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handlePhotoFileChange}
              disabled={uploadingPhoto}
              className="hidden"
            />
          </label>
          {photoError && <p className="text-xs text-red-500">{photoError}</p>}
          <p className="text-center text-xs text-slate-400 sm:text-left">jpg, png, webp — max 5MB</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS}>Title</label>
            <input
              placeholder="e.g. Full-Stack Developer & Designer"
              value={form.title ?? ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Bio</label>
            <textarea
              rows={6}
              placeholder="Tell visitors about yourself…"
              value={form.bio ?? ""}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={FIELD_CLASS}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Phone</label>
              <input
                placeholder="+1 (000) 000-0000"
                value={form.phone ?? ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Address</label>
              <input
                placeholder="Remote"
                value={form.address ?? ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={FIELD_CLASS}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Résumé (PDF)</label>
            <label className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
              {uploadingResume ? "Uploading…" : "Choose file"}
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleResumeFileChange}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
            {resumeError && <p className="mt-1 text-xs text-red-500">{resumeError}</p>}
            {(form.resume_url || profile?.resume_url) && (
              <a
                href={form.resume_url ?? profile?.resume_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-xs text-indigo-600 hover:underline dark:text-indigo-400"
              >
                View current résumé ↗
              </a>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}