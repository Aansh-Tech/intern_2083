import { formatDate } from "../../../common/utils/formatDate";
import { EmptyState } from "../../../common/components/EmptyState";
import type { Comment } from "../../../types/comment.types";

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
    <ul className="space-y-6">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-slate-900 dark:text-white">
              {comment.name}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {formatDate(comment.createdAt)}
            </p>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {comment.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
