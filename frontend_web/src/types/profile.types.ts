import type { Skill } from "./skill.types";
import type { SocialLink } from "./socialLink.types";

export interface ProfileImage {
  id: number; // this is the imageables (attachment) id — needed for DELETE /v1/images/{id}
  type: string;
  display_order: number;
  is_primary: boolean;
  image: {
    id: number;
    filename: string;
    alt_text: string | null;
    caption: string | null;
    url: string;
  };
}

/**
 * Matches ProfileController@show exactly (snake_case, as Laravel returns it).
 *
 * `profile_photo` is deprecated by backend — not synced, kept only for
 * backwards compatibility. Use `images` (filter type: "avatar", is_primary: true)
 * for the current profile picture instead.
 *
 * NOTE: no `name`/`email` field -- those live on `users`, handled via
 * static SITE_CONFIG instead.
 */
export interface Profile {
  id: number;
  bio: string;
  title: string;
  phone?: string;
  address?: string;
  /** @deprecated no longer synced by backend — use `images` instead */
  profile_photo?: string | null;
  resume_path?: string | null;
  resume_url?: string | null;
  skills: Skill[];
  social_links: SocialLink[];
  images: ProfileImage[];
}