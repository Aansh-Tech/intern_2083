import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

import type { Project } from "../types/project";
import { getProjects } from "../services/project";


interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | null>(null);



export function ProjectProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
  try {
    setLoading(true);

    const data = await getProjects();

    setProjects(data);
  } catch (error) {
    console.log("Failed to load projects", error);
  } finally {
    setLoading(false);
  }
}, []);

//   const refreshProjects = async () => {
//     try {
//       setLoading(true);

//       const data = await getProjects();

//       setProjects(data);
//     } catch (error) {
//       console.log("Failed to load projects", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refreshProjects();
//   }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        refreshProjects,
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