import { Phone, Mail, Download } from "lucide-react";
import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import { SITE_CONFIG } from "@/common/constants/siteConfig";
import { getPrimaryAvatar } from "@/common/utils/uploadImage";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";
import type { Profile } from "@/types/profile.types";
import type { SocialLink } from "@/types/socialLink.types";

interface ProfileHeaderProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
  isLoading: boolean;
  error: string | null;
}

export function ProfileHeader({ profile, socialLinks, isLoading, error }: ProfileHeaderProps) {
  if (isLoading) return <Loader />;
  if (error) return <EmptyState title="Couldn't load profile" description={error} />;
  if (!profile) return <EmptyState title="No profile data" description="Nothing to show yet." />;

  const avatar = getPrimaryAvatar(profile.images);
  const avatarSrc = resolveMediaUrl(avatar?.image.url);
  const resumeHref = resolveMediaUrl(profile.resume_url);

  return (
    <section className="grid gap-8 sm:grid-cols-[280px_1fr]">
      <div className="mx-auto h-[320px] w-[280px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 sm:mx-0">
        {avatarSrc && (
          <img
            src={avatarSrc}
            alt={SITE_CONFIG.ownerName}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {SITE_CONFIG.ownerName}
          </h1>
          {profile.title && (
            <p className="mt-2 text-lg text-muted-foreground">{profile.title}</p>
          )}
        </div>

        {profile.bio && (
          <p className="max-w-prose leading-relaxed text-foreground">{profile.bio}</p>
        )}

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {profile.phone && (
            <span className="flex items-center gap-2">
              <Phone size={16} />
              {profile.phone}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Mail size={16} />
            {SITE_CONFIG.ownerEmail}
          </span>
        </div>

        {resumeHref && (
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <Download size={16} />
            Download résumé
          </a>
        )}

        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-1">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}