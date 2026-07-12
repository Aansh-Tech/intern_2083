import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/common/components/Button";
import { useAuth } from "@/common/hooks/useAuth";
import { ROUTES } from "@/common/constants/routes";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(ROUTES.adminDashboard);
    } catch (err) {
        console.error("Login failed:", err);
        setError("Invalid email or password.");
      } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to manage your portfolio content.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">{error}</p>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</Button>
        </form>
      </div>
    </div>
  );
}