import { memo, useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import CommentCard from "./CommentCard";
import type { Comment } from "../../types/comment";
import { useResponsiveContainer } from "../../utils/responsive";

interface CommentsListProps {
  comments: Comment[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function CommentsList({ comments, onApprove, onReject, onDelete }: CommentsListProps) {
  const container = useResponsiveContainer();

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentCard
        comment={item}
        onApprove={onApprove}
        onReject={onReject}
        onDelete={onDelete}
      />
    ),
    [onApprove, onReject, onDelete]
  );

  const keyExtractor = useCallback((item: Comment) => item.id, []);

  return (
    <FlatList
      data={comments}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={[styles.content, container]}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
});

export default memo(CommentsList);