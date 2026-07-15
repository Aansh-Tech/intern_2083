import { useState, useEffect, type MouseEvent } from "react";
import { ExternalLink, X } from "lucide-react";
import { EmptyState } from "@/common/components/EmptyState";
import { resolveMediaUrl } from "@/common/utils/resolveMediaUrl";
import { certificatesService } from "../services/certificates.service";
import type { Certificate } from "@/types/certificate.types";

const FALLBACK_GRADIENTS = [
  "from-blue-400 to-indigo-600",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-orange-400 to-rose-500",
  "from-fuchsia-500 to-purple-600",
  "from-cyan-400 to-blue-500",
];

function getCardGradient(certificate: Certificate): string {
  const index = Math.abs(certificate.id) % FALLBACK_GRADIENTS.length;
  return FALLBACK_GRADIENTS[index] ?? FALLBACK_GRADIENTS[0];
}

function getPrimaryImageUrl(certificate: Certificate): string | null {
  const primary = certificate.images?.find((img) => img.is_primary) ?? certificate.images?.[0];
  return resolveMediaUrl(primary?.image?.url) ?? null;
}

export function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    let isMounted = true;
    certificatesService
      .getAll()
      .then((data) => isMounted && setCertificates(data))
      .catch((err) => isMounted && setError(err instanceof Error ? err.message : "Failed to load certificates"))
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!previewCertificate) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPreviewCertificate(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewCertificate]);

  function handleCardClick(certificate: Certificate) {
    if (getPrimaryImageUrl(certificate)) {
      setPreviewCertificate(certificate);
    }
  }

  function handleViewClick(e: MouseEvent<HTMLButtonElement>, certificate: Certificate) {
    e.stopPropagation();
    if (getPrimaryImageUrl(certificate)) {
      setPreviewCertificate(certificate);
    } else if (certificate.credential_url) {
      window.open(certificate.credential_url, "_blank", "noopener,noreferrer");
    }
  }

  if (isLoading) {
    return (
      <section className="mt-20">
        <p className="text-slate-500 dark:text-slate-400">Loading certificates…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-20">
        <p className="text-sm text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="mt-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Credentials</p>
      <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Certificates</h2>

      {certificates.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No certificates yet"
            description="Certificates added in the admin dashboard will appear here."
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => {
            const imageUrl = getPrimaryImageUrl(certificate);
            const hasViewTarget = Boolean(imageUrl || certificate.credential_url);

            return (
              <div
                key={certificate.id}
                onClick={() => handleCardClick(certificate)}
                className={`overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50 ${
                  imageUrl ? "cursor-pointer" : ""
                }`}
              >
                <div
                  className={`relative flex h-44 items-end bg-gradient-to-br p-4 ${
                    imageUrl ? "" : getCardGradient(certificate)
                  }`}
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={certificate.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <span className="relative max-w-[90%] truncate rounded-full bg-black/30 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                    {certificate.title} · Certificate
                  </span>
                </div>

                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{certificate.issuer}</p>
                    <p className="mt-1 font-semibold text-slate-900 dark:text-white">{certificate.title}</p>
                  </div>
                  {hasViewTarget && (
                    <button
                      type="button"
                      onClick={(e) => handleViewClick(e, certificate)}
                      className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewCertificate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreviewCertificate(null)}
        >
          <div className="relative max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewCertificate(null)}
              aria-label="Close"
              className="absolute -top-10 right-0 text-white hover:text-slate-300"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={getPrimaryImageUrl(previewCertificate) ?? ""}
              alt={previewCertificate.title}
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
            <p className="mt-3 text-center text-sm text-white">
              {previewCertificate.title} — {previewCertificate.issuer}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}