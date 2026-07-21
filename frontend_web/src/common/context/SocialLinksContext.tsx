import { createContext, useContext, useEffect, useState } from "react";
import { socialLinksService } from "@/Modules/about/services/socialLinks.service";
import type { SocialLink } from "@/types/socialLink.types";

const SocialLinksContext = createContext<SocialLink[]>([]);

export function SocialLinksProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    socialLinksService
      .getAll()
      .then(setLinks)
      .catch(() => setLinks([]));
  }, []);

  return (
    <SocialLinksContext.Provider value={links}>
      {children}
    </SocialLinksContext.Provider>
  );
}

export function useSocialLinks() {
  return useContext(SocialLinksContext);
}