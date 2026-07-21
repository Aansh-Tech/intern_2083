import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildNotifications } from "../services/notificationService";
import type { AppNotification } from "../services/notificationService";

const READ_IDS_KEY = "@notification_read_ids";

async function loadReadIds(): Promise<Set<string>> {
  try {
    const stored = await AsyncStorage.getItem(READ_IDS_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {}
  return new Set();
}

async function saveReadIds(ids: Set<string>): Promise<void> {
  try {
    await AsyncStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
  } catch {}
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refreshing: boolean;
  refreshNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [allNotifications, setAllNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const [items, storedReadIds] = await Promise.all([
        buildNotifications(),
        loadReadIds(),
      ]);
      if (!mountedRef.current) return;
      setAllNotifications(items);
      setReadIds(storedReadIds);
    } catch {
      console.log("Failed to load notifications");
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    if (!mountedRef.current) return;
    setRefreshing(false);
  }, [loadNotifications]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadNotifications();
      if (!mounted) return;
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [loadNotifications]);

  const markAllAsRead = useCallback(async () => {
    const ids = new Set(allNotifications.map((n) => n.id));
    setReadIds(ids);
    await saveReadIds(ids);
  }, [allNotifications]);

  const notifications = useMemo(
    () =>
      allNotifications.map((n) => ({
        ...n,
        read: readIds.has(n.id),
      })),
    [allNotifications, readIds]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshing,
        refreshNotifications,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
