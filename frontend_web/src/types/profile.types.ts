import type { Skill } from "./skill.types";
import type { SocialLink } from "./socialLink.types";

/**
 * Matches ProfileController@show exactly (snake_case, as Laravel returns it
 * raw -- not transformed through an API Resource).
 *
 * NOTE: this has no `name` or `email` field -- those live on the `users`
 * table (auth), not `profiles`, and the controller doesn't join them in.
 * Since there's only one site owner, name/email are handled as static
 * config in common/constants/siteConfig.ts instead of coming from this API.
 */
export interface Profile {
  id: string;
  bio: string;
  title: string;
  phone?: string;
  address?: string;
  profile_photo?: string;
  resume_path?: string;
  skills: Skill[];
  social_links: SocialLink[];
}