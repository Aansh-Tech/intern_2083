export type ProjectStatus = "completed" | "in-progress";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  status: ProjectStatus;
  featured: boolean;
  gradient: string[];
  githubUrl?: string;
  viewDetailsUrl?: string;
  image?: string;
  images?: Array<{ id: string; url: string }>;
}

export const projects: Project[] = [
  {
    id: "vortex-engine",
    title: "Vortex Engine",
    category: "SaaS / Analytics",
    description:
      "Real-time data processing engine with beautiful visualization layers and a robust API for enterprise integration.",
    status: "completed",
    featured: true,
    gradient: ["#5B5FEF", "#2F8AFE", "#00D4FF"],
    githubUrl: "https://github.com/",
    viewDetailsUrl: "https://example.com/vortex-engine",
  },
  {
    id: "aura-mobile",
    title: "Aura Mobile",
    category: "Health / Wellness",
    description:
      "Next-gen wellness application with habit tracking and personalized insights for better mental health.",
    status: "in-progress",
    featured: true,
    gradient: ["#D946EF", "#FB4B93"],
    githubUrl: "https://github.com/",
    viewDetailsUrl: "https://example.com/aura-mobile",
  },
  {
    id: "atlas-cli",
    title: "Atlas CLI",
    category: "Developer Tools",
    description:
      "A terminal-first knowledge base that indexes your repos and answers questions with cited source lines.",
    status: "completed",
    featured: false,
    gradient: ["#00C896", "#00B8C4"],
    githubUrl: "https://github.com/",
    viewDetailsUrl: "https://example.com/atlas-cli",
  },
  {
    id: "nebula-design-system",
    title: "Nebula Design System",
    category: "Design Systems",
    description:
      "Token-driven design system with 60+ accessible React primitives and a Figma library kept in perfect sync.",
    status: "completed",
    featured: false,
    gradient: ["#F97316", "#F43F5E"],
    githubUrl: "https://github.com/",
    viewDetailsUrl: "https://example.com/nebula-design-system",
  },
];