import { ExternalLink } from "lucide-react";
import { Card } from "../../../common/components/Card";
import { Badge } from "../../../common/components/Badge";
import { EmptyState } from "../../../common/components/EmptyState";
import type { Certificate } from "../../../types/certificate.types";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export function CertificatesSection({
  certificates,
}: CertificatesSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Certificates
      </h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Courses and certifications I've completed.
      </p>

      {certificates.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No certificates added yet" />
        </div>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {certificates.map((cert) => (
            <Card
              key={cert.id}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <Badge tone="indigo">{cert.category}</Badge>
                <p className="mt-2 font-medium text-slate-900 dark:text-white">
                  {cert.title}
                </p>
              </div>
              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}