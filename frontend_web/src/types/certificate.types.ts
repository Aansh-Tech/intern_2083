/**
 * NOTE: there is currently NO CertificateController or Certificate model
 * on the backend at all. This type exists only because the live UI shows
 * a certificates section. Ask the backend team to add this table/endpoint,
 * or drop the section from the UI until they do. Stays mock-only for now.
 */
export interface Certificate {
  id: string;
  title: string;
  category: string;
  url: string;
}