import { useState, type FormEvent } from "react";
import { Button } from "../../../common/components/Button";
import type { Comment } from "../../../types/comment.types";

interface CommentFormProps {
  blogPostId: string;
  onSubmit: (comment: Comment) => void;
}

export function CommentForm({ blogPostId, onSubmit }: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !content) {
      setError("Please fill in your name, email, and comment.");
      return;
    }

    setSubmitting(true);

    // TODO: once the API is ready, replace this with:
    // const comment = await commentsService.create(blogPostId, { name, email, content });
    await new Promise((resolve) => setTimeout(resolve, 400));

    const comment: Comment = {
      id: crypto.randomUUID(),
      blogPostId,
      name,
      content,
      createdAt: new Date().toISOString(),
    };

    onSubmit(comment);
    setName("");
    setEmail("");
    setContent("");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="Share your thoughts…"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />

      <Button type="submit" size="sm" disabled={submitting}>
        {submitting ? "Posting…" : "Post comment"}
      </Button>
    </form>
  );
}
