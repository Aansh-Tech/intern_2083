import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../../../common/components/Button";
import { ROUTES } from "../../../common/constants/routes";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-28 text-center">
      {/* soft gradient backdrop, light + dark aware */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_at_top,_theme(colors.indigo.100),_transparent_60%)]
          dark:bg-[radial-gradient(ellipse_at_top,_theme(colors.indigo.950),_transparent_60%)]
        "
      />

      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
        Available for new projects
      </span>

      <h1 className="mx-auto mt-8 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl">
        Architecting
        <br />
        <span className="text-slate-400 dark:text-slate-500">
          digital experiences.
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg text-slate-500 dark:text-slate-400">
        I design and build calm, high-performance interfaces for ambitious
        software teams. Currently focused on developer tools and design
        systems.
      </p>

      <div className="mt-10 flex items-center justify-center gap-4">
        <Link to={ROUTES.projects}>
          <Button variant="primary">
            View Projects
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link to={ROUTES.contact}>
          <Button variant="outline">Get in touch</Button>
        </Link>
      </div>
    </section>
  );
}
