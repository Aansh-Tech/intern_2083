import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Comment } from "../types/comment";
import { getAllComments, approveComment, rejectComment, deleteComment } from "../services/commentService";

interface CommentContextType {
  comments: Comment[];
  loading: boolean;
  pendingCount: number;
  approveComment: (id: string) => Promise<void>;
  rejectComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  refreshComments: () => Promise<void>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllComments();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  const pendingCount = useMemo(() => comments.filter((c) => c.status === "pending").length, [comments]);

  const handleApprove = useCallback(async (id: string) => {
    try {
      await approveComment(id);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
      );
    } catch (error) {
      console.error("Approve error:", error);
      throw error;
    }
  }, []);

  const handleReject = useCallback(async (id: string) => {
    try {
      await rejectComment(id);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "spam" } : c))
      );
    } catch (error) {
      console.error("Reject error:", error);
      throw error;
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      comments,
      loading,
      pendingCount,
      approveComment: handleApprove,
      rejectComment: handleReject,
      deleteComment: handleDelete,
      refreshComments: fetchComments,
    }),
    [comments, loading, pendingCount, handleApprove, handleReject, handleDelete, fetchComments]
  );

  return <CommentContext.Provider value={value}>{children}</CommentContext.Provider>;
};

export const useComment = (): CommentContextType => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComment must be used within a CommentProvider");
  }
  return context;
};