import { memo, useCallback } from "react";
import { FlatList } from "react-native";
import CommentCard from "./CommentCard";
import type { Comment } from "../../types/comment";

interface CommentsListProps {
  comments: Comment[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function CommentsList({ comments, onApprove, onReject, onDelete }: CommentsListProps) {
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
      contentContainerClassName="px-5 pt-4 pb-8 gap-4"
      scrollEnabled={false}
    />
  );
}

export default memo(CommentsList);