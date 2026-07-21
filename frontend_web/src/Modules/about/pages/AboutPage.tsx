
import { useEffect, useState } from "react";
import { PublicLayout } from "@/common/layouts/PublicLayout";
import { ProfileHeader } from "../components/ProfileHeader";
import { SkillBarList } from "../components/SkillBarList";
import { CertificatesSection } from "../components/CertificatesSection";
import { aboutService } from "../services/about.service";
import type { Profile } from "@/types/profile.types";
import type { Skill } from "@/types/skill.types";
import type { SocialLink } from "@/types/socialLink.types";

export function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAboutData() {
      setIsLoading(true);
      setError(null);
      try {
        const [profileData, skillsData, socialLinksData] = await Promise.all([
          aboutService.getProfile(),
          aboutService.getSkills(),
          aboutService.getSocialLinks(),
        ]);

        if (!isMounted) return;
        setProfile(profileData);
        setSkills(skillsData);
        setSocialLinks(socialLinksData);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Something went wrong loading this page.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAboutData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl flex flex-col gap-12 px-4 py-12">
        <ProfileHeader profile={profile} socialLinks={socialLinks} isLoading={isLoading} error={error} />

        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground">Skills & Craft</h2>
          <SkillBarList skills={skills} isLoading={isLoading} error={error} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground">Certificates</h2>
          <CertificatesSection />
        </section>
      </div>
    </PublicLayout>
  );
}