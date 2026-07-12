import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Comment, CommentStatus } from "../types/comment";
import { seedComments } from "../data/comments";

const STORAGE_KEY = "portfolio_comments";
const SEEDED_KEY = "portfolio_comments_seeded";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

interface CommentContextType {
  comments: Comment[];
  loading: boolean;
  pendingCount: number;
  addComment: (data: {
    blogId: string;
    blogTitle: string;
    name: string;
    email: string;
    comment: string;
  }) => Promise<void>;
  approveComment: (id: string) => Promise<void>;
  rejectComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
}

const CommentContext = createContext<CommentContextType | null>(null);

export function CommentProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const commentsRef = useRef(comments);
  commentsRef.current = comments;

  const loadComments = useCallback(async () => {
    try {
      const seeded = await AsyncStorage.getItem(SEEDED_KEY);
      if (seeded !== "true") {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seedComments));
        await AsyncStorage.setItem(SEEDED_KEY, "true");
        setComments(seedComments);
      } else {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setComments(JSON.parse(raw) as Comment[]);
        } else {
          setComments([]);
        }
      }
    } catch {
      setComments([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const persist = useCallback(async (updated: Comment[]) => {
    setComments(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addComment = useCallback(
    async (data: {
      blogId: string;
      blogTitle: string;
      name: string;
      email: string;
      comment: string;
    }) => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Comment[] = raw ? JSON.parse(raw) : commentsRef.current;
      const newComment: Comment = {
        id: generateId(),
        blogId: data.blogId,
        blogTitle: data.blogTitle,
        name: data.name.trim(),
        email: data.email.trim(),
        comment: data.comment.trim(),
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      current.unshift(newComment);
      await persist(current);
    },
    [persist]
  );

  const approveComment = useCallback(
    async (id: string) => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Comment[] = raw ? JSON.parse(raw) : commentsRef.current;
      const index = current.findIndex((c) => c.id === id);
      if (index === -1) return;
      current[index] = { ...current[index], status: "approved" };
      await persist(current);
    },
    [persist]
  );

  const rejectComment = useCallback(
    async (id: string) => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Comment[] = raw ? JSON.parse(raw) : commentsRef.current;
      const index = current.findIndex((c) => c.id === id);
      if (index === -1) return;
      current[index] = { ...current[index], status: "spam" };
      await persist(current);
    },
    [persist]
  );

  const deleteComment = useCallback(
    async (id: string) => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Comment[] = raw ? JSON.parse(raw) : commentsRef.current;
      const filtered = current.filter((c) => c.id !== id);
      await persist(filtered);
    },
    [persist]
  );

  const pendingCount = useMemo(
    () => comments.filter((c) => c.status === "pending").length,
    [comments]
  );

  return (
    <CommentContext.Provider
      value={{
        comments,
        loading,
        pendingCount,
        addComment,
        approveComment,
        rejectComment,
        deleteComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export function useComment(): CommentContextType {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComment must be used within a CommentProvider");
  }
  return context;
}
