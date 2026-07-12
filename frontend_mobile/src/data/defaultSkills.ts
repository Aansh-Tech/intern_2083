import type { Skill } from "../types/skill";

export const defaultSkills: Skill[] = [
  {
    id: "skill-1",
    category: "Frontend",
    name: "React & Next.js",
    percentage: 95,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "skill-2",
    category: "Frontend",
    name: "TypeScript",
    percentage: 92,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "skill-3",
    category: "Frontend",
    name: "Tailwind CSS",
    percentage: 96,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "skill-4",
    category: "Backend",
    name: "Node.js",
    percentage: 85,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "skill-5",
    category: "Backend",
    name: "PostgreSQL",
    percentage: 78,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "skill-6",
    category: "Design",
    name: "Figma",
    percentage: 94,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "skill-7",
    category: "Design",
    name: "Design Systems",
    percentage: 90,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export const skillCategories: Skill["category"][] = [
  "Frontend",
  "Backend",
  "Design",
  "Other",
];
