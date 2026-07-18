import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { Comment } from "../types/comment";
import { getAllComments, approveComment, rejectComment, deleteComment } from "../services/commentService";
import { getToken } from "../utils/token";

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
      const token = await getToken();
      if (!token) {
        setComments([]);
        return;
      }
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
      console.log("[AdminComments] Approving comment:", id);
      await approveComment(id);
      console.log("[AdminComments] Comment approved. Refreshing comments...");
      await fetchComments();
    } catch (error) {
      console.error("Approve error:", error);
      throw error;
    }
  }, [fetchComments]);

  const handleReject = useCallback(async (id: string) => {
    try {
      console.log("[AdminComments] Rejecting comment:", id);
      await rejectComment(id);
      console.log("[AdminComments] Comment rejected. Refreshing comments...");
      await fetchComments();
    } catch (error) {
      console.error("Reject error:", error);
      throw error;
    }
  }, [fetchComments]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      console.log("[AdminComments] Deleting comment:", id);
      await deleteComment(id);
      console.log("[AdminComments] Comment deleted. Refreshing comments...");
      await fetchComments();
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }, [fetchComments]);

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