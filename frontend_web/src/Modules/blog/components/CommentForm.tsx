import { useState, type FormEvent } from "react";
import { Button } from "@/common/components/Button";
import { commentsService } from "../services/comments.service";
import type { Comment, CommentPayload } from "@/types/comment.types";

interface CommentFormProps {
  postSlug: string;
  onCommentAdded: (comment: Comment) => void;
}

export function CommentForm({ postSlug, onCommentAdded }: CommentFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!authorName.trim() || !content.trim()) return;

    setStatus("submitting");
    setErrorMessage(null);

    const payload: CommentPayload = { author_name: authorName, content };

    try {
      const newComment = await commentsService.submit(postSlug, payload);
      onCommentAdded(newComment);
      setAuthorName("");
      setContent("");
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Couldn't post your comment right now."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Your name"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
      />
      <textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
      />
      {status === "error" && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
      <Button type="submit" variant="primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Posting..." : "Post comment"}
      </Button>
    </form>
  );
}