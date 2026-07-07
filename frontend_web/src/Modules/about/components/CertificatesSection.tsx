import { EmptyState } from "@/common/components/EmptyState";
import { Card } from "@/common/components/Card";

// NOTE: No CertificateController/model exists on the backend at all (per handoff).
// This deliberately does NOT call an API or import mock data — it renders
// an empty state until backend support exists. Swap the EmptyState below
// for a real fetch once the endpoint is confirmed.

export function CertificatesSection() {
  const certificates: never[] = []; // placeholder until backend exists

  if (certificates.length === 0) {
    return (
      <EmptyState
        title="Certificates coming soon"
        description="This section will populate once the backend supports certificates."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {certificates.map((cert: any) => (
        <Card key={cert.id}>{cert.name}</Card>
      ))}
    </div>
  );
}