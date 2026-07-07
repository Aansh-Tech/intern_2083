// modules/contact/components/ContactForm.tsx

import { useState, type FormEvent } from "react";
import { Button } from "@/common/components/Button";
import { contactService } from "../services/contact.services";
import type { ContactMessagePayload } from "@/types/contactMessage.types";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email address.";
    }

    // subject is optional (backend validation: "nullable") — no check needed

    if (!form.message.trim()) {
      errors.message = "Message can't be empty.";
    } else if (form.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage(null);

    const payload: ContactMessagePayload = {
      name: form.name,
      email: form.email,
      subject: form.subject.trim() ? form.subject : undefined,
      message: form.message,
    };

    try {
      await contactService.submit(payload);
      setStatus("success");
      setForm(INITIAL_STATE);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong sending your message."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border p-6 text-center">
        <p className="text-foreground font-medium">Message sent.</p>
        <p className="text-muted-foreground text-sm mt-1">
          Thanks for reaching out — I'll get back to you soon.
        </p>
        <Button variant="ghost" onClick={() => setStatus("idle")} className="mt-4">
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
        />
        {fieldErrors.name && <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
        />
        {fieldErrors.email && <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
          Subject <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          id="subject"
          type="text"
          value={form.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
          Message
        </label>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          rows={5}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
        />
        {fieldErrors.message && <p className="text-sm text-red-500 mt-1">{fieldErrors.message}</p>}
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      <Button type="submit" variant="primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}