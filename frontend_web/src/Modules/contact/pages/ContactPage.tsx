// modules/contact/pages/ContactPage.tsx

import { Mail, User, MessageCircle } from "lucide-react";
import { ContactForm } from "../components/ContactForm";
import { SITE_CONFIG } from "@/common/constants/siteConfig";

export function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Say hello</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">Get in touch</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Have a project in mind or just want to say hi? I'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <aside className="lg:col-span-2 flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-8 text-white">
          <div>
            <MessageCircle className="h-8 w-8 opacity-80" />
            <p className="mt-4 text-lg font-semibold">Let's build something together.</p>
            <p className="mt-2 text-sm text-white/80">
              I usually reply within a day or two.
            </p>
          </div>

          <div className="mt-auto space-y-4 border-t border-white/20 pt-6">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 opacity-80" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">Name</p>
                <p className="text-sm font-medium">{SITE_CONFIG.ownerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 opacity-80" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">Email</p>
                <p className="text-sm font-medium">{SITE_CONFIG.ownerEmail}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}