export interface Certificate {
  id: number;
  profile_id: number;
  title: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  credential_url?: string;
  image?: string;
  description?: string;
  display_order?: number;
}