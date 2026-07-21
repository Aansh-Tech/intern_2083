import type { SocialLink } from "./socialLink";

export interface ProfileData {
  id?: number;
  name?: string;
  title?: string;
  subtitle?: string;
  headline?: string;
  bio?: string;
  description?: string;
  email?: string;
  phone?: string;
  location?: string;
  resume?: string;
  resume_url?: string;
  resume_path?: string;
  avatar?: string;
  profile_image?: string;
  profile_photo?: string;
  cover_image?: string;
  socialLinks?: SocialLink[];
  github_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  [key: string]: unknown;
}
