import { useState, useCallback, useMemo } from "react";
import { View } from "react-native";
import AdminLayout from "../../components/adminoverview/AdminLayout";
import AdminCommentsHeader from "../../components/admincomments/AdminCommentsHeader";
import SearchBar from "../../components/admincomments/SearchBar";
import FilterTabs from "../../components/admincomments/FilterTabs";
import type { FilterValue } from "../../components/admincomments/FilterTabs";
import CommentsList from "../../components/admincomments/CommentsList";
import EmptyComments from "../../components/admincomments/EmptyComments";
import { useComment } from "../../context/CommentContext";

export default function AdminCommentsScreen() {
  const { comments, loading, pendingCount, approveComment, rejectComment, deleteComment } =
    useComment();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const displayedComments = useMemo(() => {
    let result = comments;

    if (filter === "pending") {
      result = result.filter((c) => c.status === "pending");
    } else if (filter === "approved") {
      result = result.filter((c) => c.status === "approved");
    } else if (filter === "spam") {
      result = result.filter((c) => c.status === "spam");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.blogTitle.toLowerCase().includes(q) ||
          c.comment.toLowerCase().includes(q)
      );
    }

    return result;
  }, [comments, filter, searchQuery]);

  const handleApprove = useCallback(
    (id: string) => approveComment(id),
    [approveComment]
  );
  const handleReject = useCallback(
    (id: string) => rejectComment(id),
    [rejectComment]
  );
  const handleDelete = useCallback(
    (id: string) => deleteComment(id),
    [deleteComment]
  );

  return (
    <AdminLayout>
      <AdminCommentsHeader pendingCount={pendingCount} />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View className="pt-4">
        <FilterTabs value={filter} onChange={setFilter} />
      </View>
      {loading ? null : displayedComments.length === 0 ? (
        <EmptyComments />
      ) : (
        <CommentsList
          comments={displayedComments}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}
    </AdminLayout>
  );
}
