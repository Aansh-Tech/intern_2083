import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { ProfileData } from "../types/profile";
import * as profileService from "../services/profile";

console.log = () => {};
console.info = () => {};
console.debug = () => {};
interface ProfileContextType {
  profile: ProfileData;
  loading: boolean;
  refreshing: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const data = await profileService.getProfile();
      if (!mountedRef.current) return;
      setProfile(data);
    } catch {
      console.log("Failed to load profile");
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadProfile();
    } finally {
      if (!mountedRef.current) return;
      setRefreshing(false);
    }
  }, [loadProfile]);

  const updateProfileHandler = useCallback(
    async (data: Partial<ProfileData>) => {
      try {
        const updated = await profileService.updateProfile(data, "profile", profile.id);
        if (!mountedRef.current) return;
        setProfile((prev) => ({ ...prev, ...updated }));
      } catch {
        console.log("Failed to update profile");
        throw new Error("Failed to update profile");
      }
    },
    [profile.id]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadProfile();
      if (!mounted) return;
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [loadProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        refreshing,
        refreshProfile,
        updateProfile: updateProfileHandler,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
