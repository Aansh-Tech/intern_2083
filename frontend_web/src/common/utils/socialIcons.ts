import { Link2, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * lucide-react in this project has dropped several brand icons across
 * versions, so we deliberately avoid platform-specific icons (Github,
 * Linkedin, Twitter, Instagram, Facebook, etc.) entirely and use a
 * generic link icon for everything except email.
 */
export function getSocialIcon(platform: string): LucideIcon {
  const key = platform.trim().toLowerCase();
  if (key === "email" || key === "mail") return Mail;
  return Link2;
}