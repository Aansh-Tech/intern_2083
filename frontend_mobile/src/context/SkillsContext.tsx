import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Skill, SkillCategory } from "../types/skill";
import { defaultSkills } from "../data/defaultSkills";

const STORAGE_KEY = "portfolio_skills";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

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

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const skillsRef = useRef(skills);
  skillsRef.current = skills;

  const loadSkills = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSkills(JSON.parse(raw) as Skill[]);
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSkills));
        setSkills(defaultSkills);
      }
    } catch {
      setSkills(defaultSkills);
    }
    setLoading(false);
  }, []);

  const refreshSkills = useCallback(async () => {
    setRefreshing(true);
    await loadSkills();
    setRefreshing(false);
  }, [loadSkills]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const persist = useCallback(async (updated: Skill[]) => {
    setSkills(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addSkill = useCallback(
    async (data: { category: SkillCategory; name: string; percentage: number }): Promise<string | null> => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Skill[] = raw ? JSON.parse(raw) : skillsRef.current;

      const nameTrimmed = data.name.trim();
      if (!nameTrimmed) return "Skill name cannot be empty";
      if (data.percentage < 0 || data.percentage > 100) return "Percentage must be between 0 and 100";
      if (current.some((s) => s.name.toLowerCase() === nameTrimmed.toLowerCase())) {
        return "A skill with this name already exists";
      }

      const newSkill: Skill = {
        id: generateId(),
        category: data.category,
        name: nameTrimmed,
        percentage: data.percentage,
        createdAt: new Date().toISOString(),
      };
      current.push(newSkill);
      await persist(current);
      return null;
    },
    [persist]
  );

  const updateSkill = useCallback(
    async (id: string, data: { category: SkillCategory; name: string; percentage: number }): Promise<string | null> => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Skill[] = raw ? JSON.parse(raw) : skillsRef.current;

      const nameTrimmed = data.name.trim();
      if (!nameTrimmed) return "Skill name cannot be empty";
      if (data.percentage < 0 || data.percentage > 100) return "Percentage must be between 0 and 100";

      const duplicate = current.find(
        (s) => s.name.toLowerCase() === nameTrimmed.toLowerCase() && s.id !== id
      );
      if (duplicate) return "A skill with this name already exists";

      const index = current.findIndex((s) => s.id === id);
      if (index === -1) return "Skill not found";

      current[index] = { ...current[index], ...data, name: nameTrimmed };
      await persist(current);
      return null;
    },
    [persist]
  );

  const deleteSkill = useCallback(
    async (id: string) => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Skill[] = raw ? JSON.parse(raw) : skillsRef.current;
      const filtered = current.filter((s) => s.id !== id);
      await persist(filtered);
    },
    [persist]
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
