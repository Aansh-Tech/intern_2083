import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

interface AdminLayoutProps {
  children: ReactNode;
}

const ADMIN_NAV_LINKS = [
  { label: "Dashboard", to: "/admin" },
  { label: "Profile", to: "/admin/profile" },
  { label: "Skills", to: "/admin/skills" },
  { label: "Projects", to: "/admin/projects" },
  { label: "Blog Posts", to: "/admin/blog-posts" },
  { label: "Comments", to: "/admin/comments" },
  { label: "Contact Messages", to: "/admin/contact-messages" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.adminLogin);
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-8 text-lg font-bold">Admin</p>
        <nav className="space-y-1">
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          Log out
        </button>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}