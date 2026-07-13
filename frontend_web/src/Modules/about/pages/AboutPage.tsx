import { useEffect, useState } from "react";
import { ProfileHeader } from "../components/ProfileHeader";
import { aboutService } from "../services/about.service";
import type { Profile } from "@/types/profile.types";

export function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    aboutService
      .getProfile()
      .then((data) => isMounted && setProfile(data))
      .catch((err) => isMounted && setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <ProfileHeader profile={profile} socialLinks={[]} isLoading={isLoading} error={error} />
    </div>
  );
}