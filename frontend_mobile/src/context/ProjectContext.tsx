import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";

import type { Project } from "../types/project";
import * as projectService from "../services/project";


console.log = () => {};
console.info = () => {};
console.debug = () => {};
//import { getToken } from "../utils/token";

// interface ProjectContextType {
//   projects: Project[];
//   loading: boolean;
//   refreshProjects: () => Promise<void>;
// }

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  refreshing: boolean;
  refreshProjects: (admin?: boolean) => Promise<void>;

  addProject: (data: any) => Promise<any>;
  editProject: (id: string, data: any) => Promise<any>;
  deleteProject: (id: string) => Promise<void>;

  toggleFeatured: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | null>(null);



export function ProjectProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadProjects = useCallback(async (admin = false) => {
    try {
      console.log("Fetching projects from Laravel...");
      const data = await projectService.getProjects(admin);
      console.log("Projects from API:", data);
      if (!mountedRef.current) return;
      setProjects(data);
    } catch (error) {
      console.log("Failed to load projects", error);
    }
  }, []);


  const refreshProjects = useCallback(async (admin = false) => {
  setRefreshing(true);

  try {
    await loadProjects(admin);
  } finally {
    if (!mountedRef.current) return;
    setRefreshing(false);
  }
}, [loadProjects]);

  // const refreshProjects = useCallback(async () => {
  //   setRefreshing(true);
  //   await loadProjects();
  //   setRefreshing(false);
  // }, [loadProjects]);

  // useEffect(() => {
  //   (async () => {
  //     await loadProjects();
  //     setLoading(false);
  //   })();
  // }, [loadProjects]);

  // useEffect(() => {
  // const init = async () => {
  //   console.log("[ProjectContext] init effect running, checking token...");
  //   //const token = await getToken();
  //   console.log("[ProjectContext] token present:", !!token);

  //  // if (token) {
  //     console.log("[ProjectContext] loading projects on init...");
  //     try {
  //      // await loadProjects();
  //     } catch (error) {
  //       console.log("[ProjectContext] loadProjects on init threw:", error);
  //     }
  //   }

  //   setLoading(false);
  //   console.log("[ProjectContext] init complete, loading=false");
  // };


  useEffect(() => {
  let mounted = true;
  const init = async () => {
    console.log("[ProjectContext] Loading public projects...");

    try {
      await loadProjects();
    } catch (error) {
      console.log("[ProjectContext] Failed to load projects:", error);
    } finally {
      if (!mounted) return;
      setLoading(false);
      console.log("[ProjectContext] init complete");
    }
  };

  init();
  return () => {
    mounted = false;
  };
}, [loadProjects]);

  const addProject = async (data: any) => {
  const result = await projectService.createProject(data);
  await refreshProjects();
  return result;
};

const editProject = async (id: string, data: any) => {
  const result = await projectService.updateProject(id, data);
  await refreshProjects();
  return result;
};

const deleteProject = async (id: string) => {
  await projectService.deleteProject(id);
  await refreshProjects();
};

const toggleFeatured = async (id: string) => {
  const project = projects.find((p) => p.id === id);
  if (!project) return;

  await projectService.updateProject(id, {
    is_featured: !project.featured,
  });

  await refreshProjects();
};

const toggleCompleted = async (id: string) => {
  const project = projects.find((p) => p.id === id);
  if (!project) return;

  await projectService.updateProject(id, {
    status: project.completed ? "draft" : "published",
  });

  await refreshProjects();
};

  // return (
  //   <ProjectContext.Provider
  //     value={{
  //       projects,
  //       loading,
  //       refreshProjects,
  //     }}
      return (
       <ProjectContext.Provider
      value={{
      projects,
      loading,
      refreshing,
      refreshProjects,

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

export function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used inside ProjectProvider");
  }

  return context;
}