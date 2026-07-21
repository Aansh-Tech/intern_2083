import type { ReactNode } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SocialLinksProvider } from "../context/SocialLinksContext";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <SocialLinksProvider>
      <div className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SocialLinksProvider>
  );
}