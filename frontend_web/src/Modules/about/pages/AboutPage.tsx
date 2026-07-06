import { ProfileHeader } from "../components/ProfileHeader";
import { SkillBarList } from "../components/SkillBarList";
import { CertificatesSection } from "../components/CertificatesSection";
import {
  mockProfile,
  mockAboutSkills,
  mockCertificates,
} from "../mock/about.mock";

// TODO: once the API is ready, replace the mock imports above with:
// const { data: profile } = useQuery(["profile"], profileService.get);
// const { data: skills } = useQuery(["skills"], skillsService.getAll);
// const { data: certificates } = useQuery(["certificates"], certificatesService.getAll);

export function AboutPage() {
  return (
    <>
      <ProfileHeader profile={mockProfile} />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Skills & craft
        </h2>
        <div className="mt-10">
          <SkillBarList skills={mockAboutSkills} />
        </div>
      </section>

      <CertificatesSection certificates={mockCertificates} />
    </>
  );
}