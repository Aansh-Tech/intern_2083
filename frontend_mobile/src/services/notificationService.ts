import * as contactService from "./contact";
import { getAllComments } from "./commentService";

export interface AppNotification {
  id: string;
  type: "contact" | "comment";
  title: string;
  subtitle: string;
  createdAt: string;
  read?: boolean;
}

export async function buildNotifications(): Promise<AppNotification[]> {
  const [contacts, comments] = await Promise.all([
    contactService.getContacts().catch(() => [] as any[]),
    getAllComments().catch(() => []),
  ]);

  const list: AppNotification[] = [];

  for (const c of contacts ?? []) {
    list.push({
      id: `contact-${c.id}`,
      type: "contact",
      title: "New contact",
      subtitle: `${c.name} sent you a message.`,
      createdAt: c.created_at || c.date || new Date().toISOString(),
    });
  }

  for (const c of comments ?? []) {
    list.push({
      id: `comment-${c.id}`,
      type: "comment",
      title: "New comment",
      subtitle: `"${c.comment.substring(0, 60)}"`,
      createdAt: c.createdAt,
    });
  }

  list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return list.slice(0, 10);
}
