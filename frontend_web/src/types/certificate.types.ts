export interface Certificate {
  id: number;
  profile_id: number;
  skill_id?: number; // confirmed — backend added this column
  title: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  credential_url?: string;
    images?: Array<{
    is_primary: boolean;
    image: { url: string };
  }>;
  description?: string;
  display_order?: number;
}