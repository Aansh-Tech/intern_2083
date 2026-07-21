export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  gradient: [string, string];
  githubLink: string;
  projectLink: string;
  featured: boolean;
  image?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Vortex Engine",
    category: "SAAS / ANALYTICS",
    description:
      "Real-time data processing with beautiful visualization layers.",
    gradient: ["#7A5AF8", "#18BFFF"],
    githubLink: "https://github.com",
    projectLink: "/project",
    featured: true,
  },
  {
    id: 2,
    title: "Aura Mobile",
    category: "MOBILE / HEALTHCARE",
    description:
      "Next-generation wellness app with habit tracking and personalized insights.",
    gradient: ["#FF6B6B", "#FF8C42"],
    githubLink: "https://github.com",
    projectLink: "/project",
    featured: true,
  },
  {
    id: 3,
    title: "Task Manager",
    category: "Productivity",
    description:
      "A sleek task management app with drag-and-drop boards, reminders, and team collaboration.",
    gradient: ["#00B4D8", "#90E0EF"],
    githubLink: "https://github.com",
    projectLink: "/project",
    featured: false,
  },
  {
    id: 4,
    title: "E-Commerce Platform",
    category: "Full Stack",
    description:
      "End-to-end e-commerce solution with payment processing, inventory management, and analytics.",
    gradient: ["#7209B7", "#F72585"],
    githubLink: "https://github.com",
    projectLink: "/project",
    featured: false,
  },
];