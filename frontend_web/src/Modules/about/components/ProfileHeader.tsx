import { Loader } from "@/common/components/Loader";
import { EmptyState } from "@/common/components/EmptyState";
import { Button } from "@/common/components/Button";
import { Link2 } from "lucide-react";
import { SITE_CONFIG } from "@/common/constants/siteConfig";
import type { Profile } from "@/types/profile.types";
import type { SocialLink } from "@/types/socialLink.types";

interface ProfileHeaderProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
  isLoading: boolean;
  error: string | null;
}

export function ProfileHeader({
  profile,
  socialLinks,
  isLoading,
  error,
}: ProfileHeaderProps) {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Couldn't load profile"
        description={error}
      />
    );
  }

  if (!profile) {
    return (
      <EmptyState
        title="No profile data"
        description="Nothing to show yet."
      />
    );
  }

  return (
    <section className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
      <img
        src={profile.profile_photo}
        alt={SITE_CONFIG.ownerName}
        className="h-32 w-32 rounded-full object-cover border border-border"
      />

      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {SITE_CONFIG.ownerName}
          </h1>

          {profile.title && (
            <p className="text-muted-foreground">{profile.title}</p>
          )}
        </div>

        {profile.bio && (
          <p className="max-w-prose text-foreground">
            {profile.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>{SITE_CONFIG.ownerEmail}</span>
          {profile.phone && <span>{profile.phone}</span>}
          {profile.address && <span>{profile.address}</span>}
        </div>

        {socialLinks.length > 0 && (
          <div className="flex gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <Link2 size={16} />
                {link.platform}
              </a>
            ))}
          </div>
        )}

        {profile.resume_path && (
          <Button variant="primary">
            <a href={profile.resume_path} download>
              Download résumé
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}