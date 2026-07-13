export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}
export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}