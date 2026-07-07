import { useState, useEffect } from "react";
import { ProfileHeader } from "../components/ProfileHeader";
import { SkillBarList } from "../components/SkillBarList";
import { CertificatesSection } from "../components/CertificatesSection";
import { getProfile } from "../services/about.service";
import { getSkills } from "../services/about.service";
import type { Profile } from "../../../types/profile.types";
import type { Skill } from "../../../types/skill.types";
import type { Certificate } from "../../../types/certificate.types";

// Hardcoded mock data as fallback
const MOCK_PROFILE: Profile = {
  id: 1,
  bio: "Full-stack developer with a passion for building beautiful, functional web applications. I specialize in React, TypeScript, and Laravel.",
  title: "Full Stack Developer",
  phone: "+1 (555) 123-4567",
  address: "San Francisco, CA",
  profile_photo: "/images/profile.jpg",
  resume_path: "/resume.pdf",
  skills: [],
  social_links: []
};

const MOCK_SKILLS: Skill[] = [
  {
    id: 1,
    profile_id: 1,
    name: "React",
    photo: "/icons/react.svg",
    display_order: 1,
    percentage: 90,
    category: "Frontend"
  },
  {
    id: 2,
    profile_id: 1,
    name: "TypeScript",
    photo: "/icons/typescript.svg",
    display_order: 2,
    percentage: 85,
    category: "Frontend"
  },
  {
    id: 3,
    profile_id: 1,
    name: "Tailwind CSS",
    photo: "/icons/tailwind.svg",
    display_order: 3,
    percentage: 80,
    category: "Frontend"
  },
  {
    id: 4,
    profile_id: 1,
    name: "Laravel",
    photo: "/icons/laravel.svg",
    display_order: 4,
    percentage: 75,
    category: "Backend"
  },
  {
    id: 5,
    profile_id: 1,
    name: "PHP",
    photo: "/icons/php.svg",
    display_order: 5,
    percentage: 70,
    category: "Backend"
  },
  {
    id: 6,
    profile_id: 1,
    name: "MySQL",
    photo: "/icons/mysql.svg",
    display_order: 6,
    percentage: 65,
    category: "Backend"
  },
  {
    id: 7,
    profile_id: 1,
    name: "Figma",
    photo: "/icons/figma.svg",
    display_order: 7,
    percentage: 60,
    category: "Design"
  },
  {
    id: 8,
    profile_id: 1,
    name: "UI/UX Design",
    photo: "/icons/uiux.svg",
    display_order: 8,
    percentage: 55,
    category: "Design"
  }
];

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 1,
    name: "React Developer Certification",
    issuer: "Meta",
    issue_date: "2023-06-15",
    credential_id: "REACT-12345",
    credential_url: "https://coursera.org/verify/react-12345",
    logo: "/certificates/react.svg"
  },
  {
    id: 2,
    name: "Laravel Certified Developer",
    issuer: "Laravel",
    issue_date: "2023-09-20",
    credential_id: "LARAVEL-67890",
    credential_url: "https://laravel.com/certify/67890",
    logo: "/certificates/laravel.svg"
  },
  {
    id: 3,
    name: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    issue_date: "2024-01-10",
    credential_id: "AWS-11111",
    credential_url: "https://aws.amazon.com/verify/11111",
    logo: "/certificates/aws.svg"
  }
];

export function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load profile
        try {
          const profileResponse = await getProfile();
          setProfile(profileResponse.data);
        } catch (profileErr) {
          console.error('Failed to load profile:', profileErr);
          setProfile(MOCK_PROFILE);
          setError('Using mock data (Profile API unavailable)');
        }

        // Load skills
        try {
          const skillsResponse = await getSkills();
          setSkills(skillsResponse.data);
        } catch (skillsErr) {
          console.error('Failed to load skills:', skillsErr);
          setSkills(MOCK_SKILLS);
          if (!error) setError('Using mock data (Skills API unavailable)');
        }

        // Certificates - always use mock since no API exists
        setCertificates(MOCK_CERTIFICATES);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load about page data:', err);
        // Fallback to all mock data
        setProfile(MOCK_PROFILE);
        setSkills(MOCK_SKILLS);
        setCertificates(MOCK_CERTIFICATES);
        setError('Using mock data (API unavailable)');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-500 dark:text-slate-400">Loading about page...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400">Failed to load profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
            ⚠️ {error}
          </div>
        </div>
      )}

      <ProfileHeader profile={profile} />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Skills & craft
        </h2>
        <div className="mt-10">
          <SkillBarList skills={skills} />
        </div>
      </section>

      {certificates.length > 0 && (
        <CertificatesSection certificates={certificates} />
      )}
    </>
  );
}