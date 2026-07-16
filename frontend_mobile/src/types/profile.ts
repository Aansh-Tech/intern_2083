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
  avatar?: string;
  profile_image?: string;
  profile_photo?: string;
  cover_image?: string;
  social_links?: Record<string, string>;
  [key: string]: unknown;
}
