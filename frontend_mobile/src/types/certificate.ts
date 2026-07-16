export interface Certificate {
  id: string;
  title: string;
  issuer?: string;
  category?: string;
  description?: string;
  issueDate?: string;
  image?: string | null;
  url?: string;
  createdAt?: string;
}
