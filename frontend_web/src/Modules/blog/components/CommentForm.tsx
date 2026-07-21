import { useState, type FormEvent } from "react";
import { Button } from "@/common/components/Button";
import { commentsService } from "../services/comments.service";
import type { Comment, CommentPayload } from "@/types/comment.types";

interface CommentFormProps {
  postId: number;
  onCommentAdded: (comment: Comment) => void;
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !content.trim()) return;

    setStatus("submitting");
    setErrorMessage(null);

    const payload: CommentPayload = {
      blog_post_id: postId,
      name,
      email,
      content,
    };

    try {
      const newComment = await commentsService.submit(payload);
      onCommentAdded(newComment);
      setName("");
      setEmail("");
      setContent("");
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      if (err?.response?.status === 429) {
        setErrorMessage("You're commenting too quickly. Please wait a minute and try again.");
      } else {
        setErrorMessage(
          err instanceof Error ? err.message : "Couldn't post your comment right now."
        );
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      {status === "success" && (
        <p className="text-sm text-emerald-600">
          Thanks! Your comment is awaiting approval and will appear once reviewed.
        </p>
      )}
      <Button type="submit" variant="primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Posting..." : "Post comment"}
      </Button>
    </form>
  );
}