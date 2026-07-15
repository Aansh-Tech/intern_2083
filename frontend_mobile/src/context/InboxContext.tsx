import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import type { InboxMessage } from "../types/inbox";
import * as contactService from "../services/contact";

interface InboxContextType {
  messages: InboxMessage[];
  loading: boolean;
  refreshing: boolean;
  unreadCount: number;

  refreshMessages: () => Promise<void>;

  addMessage: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => Promise<void>;

  markAsRead: (id: string) => Promise<void>;

  deleteMessage: (id: string) => Promise<void>;
}

const InboxContext = createContext<InboxContextType | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] =useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      console.log("Fetching inbox messages...");

      const data = await contactService.getContacts();

      console.log("Inbox:", data);

      const formatted: InboxMessage[] = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        email: item.email,
        subject: item.subject ?? "",
        message: item.message,
        date: item.created_at,
        isRead: item.read ?? false,
      }));

      setMessages(formatted);
    } catch (error) {
      console.log("Failed to load inbox", error);
    }
  }, []);

  const refreshMessages = useCallback(async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  }, [loadMessages]);

  useEffect(() => {
    (async () => {
      await loadMessages();
      setLoading(false);
    })();
  }, [loadMessages]);

  const addMessage = async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    await contactService.submitContact(data);
  };

  const deleteMessage = async (id: string) => {
    await contactService.deleteContact(id);
    await refreshMessages();
  };

  // Backend doesn't support read/unread yet
  const markAsRead = async (_id: string) => {};

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages]
  );

  return (
    <InboxContext.Provider
      value={{
        messages,
        loading,
        refreshing,
        unreadCount,
        refreshMessages,
        addMessage,
        markAsRead,
        deleteMessage,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);

  if (!context) {
    throw new Error("useInbox must be used within InboxProvider");
  }

  return context;
}