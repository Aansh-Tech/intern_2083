import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Project } from "../types/project";

const STORAGE_KEY = "portfolio_projects";
const SEEDED_KEY = "portfolio_projects_seeded";

const defaultProjects: Project[] = [
  {
    id: "vortex-engine",
    title: "Vortex Engine",
    slug: "vortex-engine",
    category: "SaaS / Analytics",
    description:
      "Real-time data processing engine with beautiful visualization layers and a robust API for enterprise integration.",
    status: "completed",
    featured: true,
    technologies: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    gradient: ["#5B5FEF", "#2F8AFE"],
    githubUrl: "https://github.com",
    viewDetailsUrl: "https://example.com/vortex-engine",
    displayOrder: 1,
    dateAdded: "2026-01-15",
    completed: true,
  },
  {
    id: "aura-mobile",
    title: "Aura Mobile",
    slug: "aura-mobile",
    category: "Health / Wellness",
    description:
      "Next-gen wellness application with habit tracking and personalized insights for better mental health.",
    status: "in-progress",
    featured: true,
    technologies: ["React Native", "TypeScript", "Firebase"],
    gradient: ["#D946EF", "#FB4B93"],
    githubUrl: "https://github.com",
    viewDetailsUrl: "https://example.com/aura-mobile",
    displayOrder: 2,
    dateAdded: "2026-02-20",
    completed: false,
  },
  {
    id: "atlas-cli",
    title: "Atlas CLI",
    slug: "atlas-cli",
    category: "Developer Tools",
    description:
      "A terminal-first knowledge base that indexes your repos and answers questions with cited source lines.",
    status: "completed",
    featured: false,
    technologies: ["Go", "TypeScript", "SQLite"],
    gradient: ["#00C896", "#00B8C4"],
    githubUrl: "https://github.com",
    viewDetailsUrl: "https://example.com/atlas-cli",
    displayOrder: 3,
    dateAdded: "2026-03-10",
    completed: true,
  },
  {
    id: "nebula-design-system",
    title: "Nebula Design System",
    slug: "nebula-design-system",
    category: "Design Systems",
    description:
      "Token-driven design system with 60+ accessible React primitives and a Figma library kept in perfect sync.",
    status: "completed",
    featured: false,
    technologies: ["React", "Storybook", "Figma", "TypeScript"],
    gradient: ["#F97316", "#F43F5E"],
    githubUrl: "https://github.com",
    viewDetailsUrl: "https://example.com/nebula-design-system",
    displayOrder: 4,
    dateAdded: "2026-04-05",
    completed: true,
  },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  addProject: (data: {
    title: string;
    category: string;
    description: string;
    githubUrl?: string;
    viewDetailsUrl?: string;
    image?: string;
    featured: boolean;
    completed: boolean;
  }) => Promise<void>;
  editProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    try {
      const seeded = await AsyncStorage.getItem(SEEDED_KEY);
      if (seeded !== "true") {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
        await AsyncStorage.setItem(SEEDED_KEY, "true");
        setProjects(defaultProjects);
      } else {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setProjects(JSON.parse(raw) as Project[]);
        } else {
          setProjects([]);
        }
      }
    } catch {
      setProjects([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const persist = useCallback(async (updated: Project[]) => {
    setProjects(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addProject = useCallback(
    async (data: {
      title: string;
      category: string;
      description: string;
      githubUrl?: string;
      viewDetailsUrl?: string;
      image?: string;
      featured: boolean;
      completed: boolean;
    }) => {
      const projects = await getCurrentProjects();
      const order = projects.length + 1;
      const newProject: Project = {
        id: generateId(),
        title: data.title.trim(),
        slug: generateSlug(data.title),
        category: data.category.trim(),
        description: data.description.trim(),
        status: data.completed ? "completed" : "in-progress",
        featured: data.featured,
        technologies: [],
        gradient: ["#5B5FEF", "#2F8AFE"],
        githubUrl: data.githubUrl?.trim() || undefined,
        viewDetailsUrl: data.viewDetailsUrl?.trim() || undefined,
        image: data.image?.trim() || undefined,
        displayOrder: order,
        dateAdded: new Date().toISOString().split("T")[0],
        completed: data.completed,
      };
      projects.push(newProject);
      await persist(projects);
    },
    [persist]
  );

  const editProject = useCallback(
    async (id: string, data: Partial<Project>) => {
      const projects = await getCurrentProjects();
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) return;
      if (data.title) {
        data.slug = generateSlug(data.title);
      }
      projects[index] = { ...projects[index], ...data };
      await persist(projects);
    },
    [persist]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const projects = await getCurrentProjects();
      const filtered = projects.filter((p) => p.id !== id);
      await persist(filtered);
    },
    [persist]
  );

  const toggleFeatured = useCallback(
    async (id: string) => {
      const projects = await getCurrentProjects();
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) return;
      projects[index] = { ...projects[index], featured: !projects[index].featured };
      await persist(projects);
    },
    [persist]
  );

  const toggleCompleted = useCallback(
    async (id: string) => {
      const projects = await getCurrentProjects();
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) return;
      const wasCompleted = projects[index].completed;
      projects[index] = {
        ...projects[index],
        completed: !wasCompleted,
        status: wasCompleted ? "in-progress" : "completed",
      };
      await persist(projects);
    },
    [persist]
  );

  async function getCurrentProjects(): Promise<Project[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Project[];
    return projects;
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        addProject,
        editProject,
        deleteProject,
        toggleFeatured,
        toggleCompleted,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
