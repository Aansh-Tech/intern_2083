// src/common/layouts/AdminLayout.tsx
import { type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Sparkles,
  FolderKanban,
  Link2,
  Award,
  Search,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../components/Themetoggle";
import { ROUTES } from "../constants/routes";
interface AdminLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", to: ROUTES.adminDashboard, icon: LayoutDashboard },
  { label: "About", to: "/admin/about", icon: User },
  { label: "Skills", to: "/admin/skills", icon: Sparkles },
  { label: "Projects", to: "/admin/projects", icon: FolderKanban },
  { label: "Social Links", to: "/admin/social-links", icon: Link2 },
  { label: "Certificates", to: "/admin/certificates", icon: Award },
];

function getPageTitle(pathname: string): string {
  const match = NAV_ITEMS.find((item) => pathname.startsWith(item.to));
  return match?.label ?? "Dashboard";
}

function getInitials(name?: string): string {
  if (!name) return "A";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.adminLogin);
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <Link to={ROUTES.home} className="mb-8 text-lg font-bold tracking-tight">
          <span className="text-indigo-600 dark:text-indigo-400">MARCHETTI</span>
          /DEV
        </Link>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-600">
          Console
        </p>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-lg font-semibold">
            {getPageTitle(location.pathname)}
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300"
            >
              <Bell className="h-4.5 w-4.5" />
            </button>

            <ThemeToggle />

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white dark:bg-indigo-500">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}