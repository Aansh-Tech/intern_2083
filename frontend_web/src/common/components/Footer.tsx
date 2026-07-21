import { Link } from "react-router-dom";
import { NAV_LINKS } from "../constants/routes";
import { SITE_CONFIG } from "../constants/siteConfig";
import { useSocialLinks } from "../context/SocialLinksContext";

export function Footer() {
  const socialLinks = useSocialLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-400">
              {SITE_CONFIG.brandPrefix}
            </span>
            /{SITE_CONFIG.brandSuffix}
          </p>
          <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            {SITE_CONFIG.footerBlurb}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Navigate
          </p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Elsewhere
          </p>
          <ul className="mt-4 space-y-2">
            {socialLinks.length > 0 ? (
              socialLinks.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
                  >
                    {social.platform}
                  </a>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400">No links added yet.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
        © {year} {SITE_CONFIG.brandPrefix}/{SITE_CONFIG.brandSuffix}. All
        rights reserved.
      </div>
    </footer>
  );
}