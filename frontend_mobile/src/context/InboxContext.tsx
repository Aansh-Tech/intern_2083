import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { InboxMessage } from "../types/inbox";
import * as contactService from "../services/contact";

const READ_IDS_KEY = "@inbox_read_ids";

async function loadReadIds(): Promise<Set<string>> {
  try {
    const stored = await AsyncStorage.getItem(READ_IDS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {}
  return new Set();
}

async function saveReadIds(ids: Set<string>): Promise<void> {
  try {
    await AsyncStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
  } catch {}
}

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

      const [data, readIds] = await Promise.all([
        contactService.getContacts(),
        loadReadIds(),
      ]);

      console.log("Inbox:", data);

      const formatted: InboxMessage[] = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        email: item.email,
        subject: item.subject ?? "",
        message: item.message,
        date: item.created_at,
        isRead: readIds.has(String(item.id)) || (item.read ?? false),
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
      console.log("[InboxContext] init effect running...");
      try {
        await loadMessages();
      } catch (error) {
        console.log("[InboxContext] loadMessages on init threw:", error);
      }
      setLoading(false);
      console.log("[InboxContext] init complete, loading=false");
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

  const markAsRead = async (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
    const readIds = await loadReadIds();
    readIds.add(id);
    await saveReadIds(readIds);
  };

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