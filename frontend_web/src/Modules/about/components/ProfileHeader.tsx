import { Link2, Download, Mail, Phone } from "lucide-react";
import { Button } from "../../../common/components/Button";
import type { Profile } from "../../../types/profile.types";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-start gap-10 md:flex-row">
        {/* Photo placeholder */}
        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-400 dark:text-slate-600">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {profile.name}
          </h1>
          <p className="mt-1 text-indigo-600 dark:text-indigo-400">
            {profile.title}
          </p>

          {profile.bio.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400"
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-300"
            >
              <Mail className="h-4 w-4" />
              {profile.email}
            </a>
            {profile.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {profile.phone}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {profile.socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                <Link2 className="h-4 w-4" />
                {social.platform}
              </a>
            ))}
          </div>

          {profile.resumePath && (
            <a href={profile.resumePath} download className="mt-8 inline-block">
              <Button variant="primary" size="sm">
                <Download className="h-4 w-4" />
                Download résumé
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}