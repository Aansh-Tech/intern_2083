import { NavLink, Link } from "react-router-dom";
import { NAV_LINKS, ROUTES } from "../constants/routes";
import { SITE_CONFIG } from "../constants/siteConfig";
import { ThemeToggle } from "./Themetoggle";

export function Navbar() {
  return (
    <header
  className="
    sticky top-0 z-50 border-b border-slate-200/70 bg-slate-100/80
    backdrop-blur-md
    dark:border-slate-800/70 dark:bg-slate-950/80
  "
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to={ROUTES.home}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          <span className="text-indigo-600 dark:text-indigo-400">
            {SITE_CONFIG.brandPrefix}
          </span>
            {SITE_CONFIG.brandSuffix}
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === ROUTES.home}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Theme toggle + Admin login */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to={ROUTES.adminLogin}
            className="
              rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium
              text-white transition-colors hover:bg-indigo-500
              dark:bg-indigo-500 dark:hover:bg-indigo-400
            "
          >
            Admin Login
          </Link>
        </div>
      </nav>
    </header>
  );
}