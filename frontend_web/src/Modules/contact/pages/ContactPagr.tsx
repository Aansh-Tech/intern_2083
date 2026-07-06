import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "../components/ContactForm";
import { mockProfile } from "../../about/mock/about.mock";

// TODO: once the API is ready, replace mockProfile with:
// const { data: profile } = useQuery(["profile"], profileService.get);

export function ContactPage() {
  const profile = mockProfile;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Get in touch
      </h1>
      <p className="mt-2 max-w-lg text-slate-500 dark:text-slate-400">
        Have a project in mind or just want to say hello? Send a message and
        I'll reply as soon as I can.
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <ContactForm />
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {profile.name}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {profile.title}
            </p>
          </div>

          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
          >
            <Mail className="h-4 w-4" />
            {profile.email}
          </a>

          {profile.phone && (
            <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Phone className="h-4 w-4" />
              {profile.phone}
            </p>
          )}

          {profile.location && (
            <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
