import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { InboxMessage } from "../types/inbox";
import { seedMessages } from "../data/inbox";

const STORAGE_KEY = "portfolio_inbox";
const SEEDED_KEY = "portfolio_inbox_seeded";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

interface InboxContextType {
  messages: InboxMessage[];
  loading: boolean;
  unreadCount: number;
  addMessage: (data: { name: string; email: string; subject: string; message: string }) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const InboxContext = createContext<InboxContextType | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const loadMessages = useCallback(async () => {
    try {
      const seeded = await AsyncStorage.getItem(SEEDED_KEY);
      if (seeded !== "true") {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seedMessages));
        await AsyncStorage.setItem(SEEDED_KEY, "true");
        setMessages(seedMessages);
      } else {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setMessages(JSON.parse(raw) as InboxMessage[]);
        } else {
          setMessages([]);
        }
      }
    } catch {
      setMessages([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const persist = useCallback(async (updated: InboxMessage[]) => {
    setMessages(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addMessage = useCallback(
    async (data: { name: string; email: string; subject: string; message: string }) => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: InboxMessage[] = raw ? JSON.parse(raw) : messagesRef.current;
      const newMsg: InboxMessage = {
        id: generateId(),
        name: data.name.trim(),
        email: data.email.trim(),
        subject: data.subject.trim(),
        message: data.message.trim(),
        date: new Date().toISOString(),
        isRead: false,
      };
      current.unshift(newMsg);
      await persist(current);
    },
    [persist]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: InboxMessage[] = raw ? JSON.parse(raw) : messagesRef.current;
      const index = current.findIndex((m) => m.id === id);
      if (index === -1) return;
      current[index] = { ...current[index], isRead: true };
      await persist(current);
    },
    [persist]
  );

  const deleteMessage = useCallback(
    async (id: string) => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: InboxMessage[] = raw ? JSON.parse(raw) : messagesRef.current;
      const filtered = current.filter((m) => m.id !== id);
      await persist(filtered);
    },
    [persist]
  );

  const unreadCount = useMemo(() => messages.filter((m) => !m.isRead).length, [messages]);

  return (
    <InboxContext.Provider
      value={{ messages, loading, unreadCount, addMessage, markAsRead, deleteMessage }}
    >
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox(): InboxContextType {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error("useInbox must be used within an InboxProvider");
  }
  return context;
}
