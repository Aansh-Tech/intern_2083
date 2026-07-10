import { useEffect, useState } from "react";
import { Button } from "@/common/components/Button";
import { adminAboutService } from "../services/adminAbout.service";
import type { Profile } from "@/types/profile.types";

const FIELD_CLASS =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export function ManageAboutPage() {
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    adminAboutService
      .getProfile()
      .then((data) => isMounted && setForm(data))
      .catch((err) => isMounted && setError(err.message))
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await adminAboutService.updateProfile(form);
      setForm(updated);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save. The backend may not support updating the profile yet."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-500">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">About</h1>
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

      <div className="mt-6 max-w-2xl space-y-4">
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
          <label className={LABEL_CLASS}>Profile photo</label>
          <input type="file" accept="image/*" className={FIELD_CLASS} />
          <p className="mt-1 text-xs text-slate-400">
            File upload isn't wired to the backend yet -- confirm
            multipart support with your backend friend.
          </p>
        </div>

        <div>
          <label className={LABEL_CLASS}>Resume</label>
          <input type="file" accept=".pdf,.doc,.docx" className={FIELD_CLASS} />
          <p className="mt-1 text-xs text-slate-400">
            File upload isn't wired to the backend yet.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}