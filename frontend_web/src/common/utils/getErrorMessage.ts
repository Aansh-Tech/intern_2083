import { isAxiosError } from "axios";

/**
 * Extracts a user-friendly error message from any API error.
 * Handles Laravel's 422 validation format: { message, errors: { field: [msgs] } }
 * Falls back to the generic message, then a default string.
 */
export function getErrorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (data?.errors) {
      const firstField = Object.keys(data.errors)[0];
      const firstMessage = data.errors[firstField]?.[0];
      if (firstMessage) return firstMessage;
    }
    if (data?.message) return data.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}