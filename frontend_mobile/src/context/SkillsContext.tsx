import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Skill, SkillCategory } from "../types/skill";
import * as skillService from "../services/skill";


interface SkillsContextType {
  skills: Skill[];
  loading: boolean;
  refreshing: boolean;
  refreshSkills: () => Promise<void>;
  addSkill: (data: {
    category: SkillCategory;
    name: string;
    percentage: number;
  }) => Promise<string | null>;
  updateSkill: (id: string, data: { category: SkillCategory; name: string; percentage: number }) => Promise<string | null>;
  deleteSkill: (id: string) => Promise<void>;
  getSkillsByCategory: () => { category: SkillCategory; skills: Skill[] }[];
}

const SkillsContext = createContext<SkillsContextType | null>(null);

function mapCategoryToBackend(category: SkillCategory): string {
  return category.toLowerCase();
}

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const skillsRef = useRef(skills);
  skillsRef.current = skills;

  const loadSkills = useCallback(async () => {
    console.log("[SkillsContext] loadSkills() called. Current skills count:", skillsRef.current.length);
    try {
      const data = await skillService.getSkills();
      console.log("[SkillsContext] getSkills returned", data.length, "skills");
      setSkills(data);
      console.log("[SkillsContext] setSkills() called with", data.length, "items");
    } catch (error: any) {
      console.log("[SkillsContext] loadSkills() CAUGHT ERROR");
      console.log("[SkillsContext] error.message:", error.message);
      console.log("[SkillsContext] error.stack:", error.stack);
    }
    setLoading(false);
    console.log("[SkillsContext] loadSkills() complete, loading=false");
  }, []);

  const refreshSkills = useCallback(async () => {
    console.log("[SkillsContext] refreshSkills() called. Current skills:", skillsRef.current.length);
    setRefreshing(true);
    try {
      await loadSkills();
    } finally {
      setRefreshing(false);
      console.log("[SkillsContext] refreshSkills() complete, skills count:", skillsRef.current.length);
    }
  }, [loadSkills]);

  useEffect(() => {
    console.log("[SkillsContext] useEffect() firing, calling loadSkills()");
    loadSkills();
  }, [loadSkills]);

  const addSkill = useCallback(
    async (data: { category: SkillCategory; name: string; percentage: number }): Promise<string | null> => {
      console.log("[SkillsContext] addSkill() called with:", JSON.stringify(data));
      const nameTrimmed = data.name.trim();
      if (!nameTrimmed) return "Skill name cannot be empty";
      if (data.percentage < 0 || data.percentage > 100) return "Percentage must be between 0 and 100";

      try {
        console.log("[SkillsContext] Calling skillService.createSkill()...");
        await skillService.createSkill({
          name: nameTrimmed,
          category: mapCategoryToBackend(data.category),
          proficiency: data.percentage,
        });
        console.log("[SkillsContext] skillService.createSkill() succeeded, calling refreshSkills()...");
        await refreshSkills();
        console.log("[SkillsContext] refreshSkills() completed after add");
        return null;
      } catch (error: any) {
        console.log("[SkillsContext] addSkill CAUGHT ERROR");
        console.log("[SkillsContext] error.message:", error.message);
        console.log("[SkillsContext] error.response?.status:", error.response?.status);
        console.log("[SkillsContext] error.response?.data:", JSON.stringify(error.response?.data));
        if (error?.response?.status === 422) {
          const msgs = error.response.data?.message ?? "Validation error";
          return typeof msgs === "string" ? msgs : "Validation error";
        }
        return "Failed to add skill";
      }
    },
    [refreshSkills]
  );

  const updateSkill = useCallback(
    async (id: string, data: { category: SkillCategory; name: string; percentage: number }): Promise<string | null> => {
      const nameTrimmed = data.name.trim();
      if (!nameTrimmed) return "Skill name cannot be empty";
      if (data.percentage < 0 || data.percentage > 100) return "Percentage must be between 0 and 100";

      try {
        await skillService.updateSkill(id, {
          name: nameTrimmed,
          category: mapCategoryToBackend(data.category),
          proficiency: data.percentage,
        });
        await refreshSkills();
        return null;
      } catch (error: any) {
        if (error?.response?.status === 422) {
          const msgs = error.response.data?.message ?? "Validation error";
          return typeof msgs === "string" ? msgs : "Validation error";
        }
        if (error?.response?.status === 404) return "Skill not found";
        return "Failed to update skill";
      }
    },
    [refreshSkills]
  );

  const deleteSkill = useCallback(
    async (id: string) => {
      try {
        await skillService.deleteSkill(id);
        await refreshSkills();
      } catch {
        console.log("Failed to delete skill");
      }
    },
    [refreshSkills]
  );

  const getSkillsByCategory = useCallback((): { category: SkillCategory; skills: Skill[] }[] => {
    const map = new Map<SkillCategory, Skill[]>();
    for (const s of skillsRef.current) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    const order: SkillCategory[] = ["Frontend", "Backend", "Design", "Other"];
    return order.filter((c) => map.has(c)).map((c) => ({ category: c, skills: map.get(c)! }));
  }, []);

  return (
    <SkillsContext.Provider
      value={{ skills, loading, refreshing, refreshSkills, addSkill, updateSkill, deleteSkill, getSkillsByCategory }}
    >
      {children}
    </SkillsContext.Provider>
  );
}


export function useSkills(): SkillsContextType {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error("useSkills must be used within a SkillsProvider");
  }
  return context;
}
