import { EmptyState } from "@/common/components/EmptyState";
import { formatDate } from "@/common/utils/formatDate";
import type { Comment } from "@/types/comment.types";

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <EmptyState
        title="No comments yet"
        description="Be the first to share your thoughts."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b border-border pb-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-foreground">{comment.author_name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
          </div>
          <p className="text-sm text-foreground">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}