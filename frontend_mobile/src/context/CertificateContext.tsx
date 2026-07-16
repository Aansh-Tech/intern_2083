import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Certificate } from "../types/certificate";
import * as certificateService from "../services/certificate";

interface CertificateContextType {
  certificates: Certificate[];
  loading: boolean;
  refreshing: boolean;
  refreshCertificates: () => Promise<void>;
  addCertificate: (data: {
    title: string;
    issuer?: string;
    category?: string;
    description?: string;
    issueDate?: string;
    image?: string;
  }) => Promise<string | undefined>;
  editCertificate: (id: string, data: {
    title?: string;
    issuer?: string;
    category?: string;
    description?: string;
    issueDate?: string;
    image?: string;
  }) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
}

const CertificateContext = createContext<CertificateContextType | null>(null);

export function CertificateProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCertificates = useCallback(async () => {
    try {
      const data = await certificateService.getCertificates();
      setCertificates(data);
    } catch {
      console.log("Failed to load certificates");
    }
  }, []);

  const refreshCertificates = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadCertificates();
    } finally {
      setRefreshing(false);
    }
  }, [loadCertificates]);

  useEffect(() => {
    (async () => {
      await loadCertificates();
      setLoading(false);
    })();
  }, [loadCertificates]);

  const addCertificate = useCallback(
    async (data: {
      title: string;
      issuer?: string;
      category?: string;
      description?: string;
      issueDate?: string;
      image?: string;
    }) => {
      try {
        const created = await certificateService.createCertificate({
          title: data.title,
          issuer: data.issuer,
          category: data.category,
          description: data.description,
          issue_date: data.issueDate,
          image: data.image,
        });
        await refreshCertificates();
        return created.id;
      } catch {
        console.log("Failed to add certificate");
        throw new Error("Failed to add certificate");
      }
    },
    [refreshCertificates]
  );

  const editCertificate = useCallback(
    async (id: string, data: {
      title?: string;
      issuer?: string;
      category?: string;
      description?: string;
      issueDate?: string;
      image?: string;
    }) => {
      try {
        await certificateService.updateCertificate(id, {
          title: data.title,
          issuer: data.issuer,
          category: data.category,
          description: data.description,
          issue_date: data.issueDate,
          image: data.image,
        });
        await refreshCertificates();
      } catch {
        console.log("Failed to update certificate");
        throw new Error("Failed to update certificate");
      }
    },
    [refreshCertificates]
  );

  const deleteCertificate = useCallback(
    async (id: string) => {
      try {
        await certificateService.deleteCertificate(id);
        await refreshCertificates();
      } catch {
        console.log("Failed to delete certificate");
      }
    },
    [refreshCertificates]
  );

  return (
    <CertificateContext.Provider
      value={{
        certificates,
        loading,
        refreshing,
        refreshCertificates,
        addCertificate,
        editCertificate,
        deleteCertificate,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificates(): CertificateContextType {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificates must be used within a CertificateProvider");
  }
  return context;
}
