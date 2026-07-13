import { Button } from "@/common/components/Button";
import { SITE_CONFIG } from "@/common/constants/siteConfig";
import { ROUTES } from "@/common/constants/routes";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center gap-6 py-20 px-4">
      <span className="rounded-full border border-border px-4 py-1 text-sm text-muted-foreground">
        Available for new projects
      </span>

      <h1 className="text-4xl sm:text-5xl font-semibold text-foreground max-w-2xl">
        Hi, I'm {SITE_CONFIG.ownerName} — I build things for the web.
      </h1>

      <p className="text-muted-foreground max-w-xl">{SITE_CONFIG.siteDescription}</p>

      <div className="flex gap-4">
        <Button variant="primary">
          <Link to={ROUTES.projects}>View projects</Link>
        </Button>
        <Button variant="outline">
          <Link to={ROUTES.contact}>Get in touch</Link>
        </Button>
      </div>
    </section>
  );
}