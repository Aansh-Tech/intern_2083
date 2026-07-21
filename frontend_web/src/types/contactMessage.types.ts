export interface ContactMessage {
  id: number;
  name: string;
  email: string; // confirmed — backend column is "email", not "email_reply"
  subject: string | null; // nullable in backend validation
  message: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string; // optional — backend validation is "nullable"
  message: string;
}