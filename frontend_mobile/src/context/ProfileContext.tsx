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
import type { SocialLink } from "../types/socialLink";
import { getAbout, getSocialLinks } from "../services/aboutService";

console.log = () => {};
console.info = () => {};
console.debug = () => {};
interface ProfileContextType {
  profile: ProfileData;
  socialLinks: SocialLink[];
  loading: boolean;
  refreshing: boolean;
  refreshProfile: () => Promise<void>;
  photoTimestamp: number;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [photoTimestamp, setPhotoTimestamp] = useState(Date.now());
  const prevAvatarRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const [profileData, links] = await Promise.all([getAbout(), getSocialLinks()]);
      if (!mountedRef.current) return;
      profileData.socialLinks = links;
      const newAvatar = profileData.avatar ?? profileData.profile_image ?? null;
      setProfile(profileData);
      setSocialLinks(links);
      if (prevAvatarRef.current !== newAvatar) {
        setPhotoTimestamp(Date.now());
      }
      prevAvatarRef.current = newAvatar;
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
        socialLinks,
        loading,
        refreshing,
        refreshProfile,
        photoTimestamp,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
