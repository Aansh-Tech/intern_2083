import type { Profile } from "../../../types/profile.types";
import type { Certificate } from "../../../types/certificate.types";
import type { Skill } from "../../../types/skill.types";

export const mockAboutSkills: Skill[] = [
  { id: "1", profile_id: "1", name: "React & Next.js", category: "Frontend", percentage: 95 },
  { id: "2", profile_id: "1", name: "TypeScript", category: "Frontend", percentage: 90 },
  { id: "3", profile_id: "1", name: "Tailwind CSS", category: "Frontend", percentage: 92 },
  { id: "4", profile_id: "1", name: "Node.js", category: "Backend", percentage: 85 },
  { id: "5", profile_id: "1", name: "Laravel", category: "Backend", percentage: 80 },
  { id: "6", profile_id: "1", name: "Figma", category: "Design", percentage: 75 },
];

export const mockProfile: Profile = {
  id: "1",
  title: "Full-Stack Developer & Designer",
  bio: "I'm a developer who cares as much about how software feels to use as how it's built. I spend most of my time in React, TypeScript, and Laravel, working on tools that make other developers' lives easier.\n\nOutside of client work, I write about interface design and contribute to a few open-source design systems.",
  phone: "+1 (000) 000-0000",
  address: "Remote",
  profile_photo: "",
  resume_path: "/resume.pdf",
  skills: mockAboutSkills,
  social_links: [
    { id: "1", profile_id: "1", platform: "GitHub", url: "https://github.com" },
    { id: "2", profile_id: "1", platform: "LinkedIn", url: "https://linkedin.com" },
    { id: "3", profile_id: "1", platform: "Twitter", url: "https://twitter.com" },
  ],
};

export const mockCertificates: Certificate[] = [
  {
    id: "1",
    title: "AWS Certified Developer – Associate",
    category: "Cloud",
    url: "https://example.com/cert1",
  },
  {
    id: "2",
    title: "Meta Front-End Developer Professional Certificate",
    category: "Frontend",
    url: "https://example.com/cert2",
  },
];