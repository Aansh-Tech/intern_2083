// modules/contact/pages/ContactPage.tsx

import { PublicLayout } from "@/common/layouts/PublicLayout";
import { ContactForm } from "../components/ContactForm";
import { SITE_CONFIG } from "@/common/constants/siteConfig";

export function ContactPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-12 px-4 py-12">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-6">Get in touch</h1>
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="text-foreground">{SITE_CONFIG.ownerName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="text-foreground">{SITE_CONFIG.ownerEmail}</p>
          </div>
        </aside>
      </div>
    </PublicLayout>
  );
}