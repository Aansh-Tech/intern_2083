/**
 * The backend's APP_URL is misconfigured -- it returns full URLs with
 * "localhost:8000" (or malformed values) instead of the actual shared
 * network IP. Confirmed via DevTools. This discards whatever host the
 * backend sends and rebuilds the URL using our own known API origin,
 * keeping only the path portion.
 *
 * Flag to backend team: fix APP_URL in their .env to the real shared IP.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export function resolveMediaUrl(rawUrl?: string | null): string | undefined {
  if (!rawUrl) return undefined;

  const trimmed = rawUrl.trim();
  let path: string;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      path = parsed.pathname + parsed.search;
    } catch {
      path = trimmed;
    }
  } else {
    path = trimmed.replace(/^:+/, "").replace(/^\/\/[^/]+/, "");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${normalizedPath}`;
}