/**
 * NOTE: ContactController is currently empty on the backend -- no store()
 * method exists yet. This shape matches the contact_messages table from
 * the DB diagram (name, email_reply, subject, message, is_read). Confirm
 * real field names once the controller is implemented -- in particular
 * whether the create payload uses "email" or "email_reply" as the key.
 */
export interface ContactMessage {
  id?: string;
  name: string;
  email_reply: string;
  subject?: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

// Shape sent FROM the contact form TO the API (no id/is_read needed on create)
export interface ContactMessagePayload {
  name: string;
  email_reply: string;
  subject?: string;
  message: string;
}