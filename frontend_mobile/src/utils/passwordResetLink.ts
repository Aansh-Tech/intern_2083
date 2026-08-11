export type PasswordResetLinkResult =
  | { ok: true; token: string; email: string }
  | { ok: false; reason: "invalid" | "missing-token" | "missing-email" };

function decodeSafe(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function getQueryParam(query: string, key: string): string | undefined {
  for (const part of query.split("&")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const name = decodeSafe(part.slice(0, eq));
    if (name === key) {
      return decodeSafe(part.slice(eq + 1));
    }
  }
  return undefined;
}

export function parsePasswordResetUrl(raw: string): PasswordResetLinkResult {
  const input = typeof raw === "string" ? raw.trim() : "";

  if (!input) {
    return { ok: false, reason: "invalid" };
  }

  const match = /^(https?:\/\/[^/?#]+)\/reset-password\/([^/?#]+)\/?(?:\?([^#]*))?(?:#.*)?$/.exec(
    input
  );

  if (!match) {
    return { ok: false, reason: "invalid" };
  }

  const token = decodeSafe(match[2]);
  if (!token) {
    return { ok: false, reason: "missing-token" };
  }

  const query = match[3] ?? "";
  const email = getQueryParam(query, "email");
  if (!email) {
    return { ok: false, reason: "missing-email" };
  }

  return { ok: true, token, email };
}