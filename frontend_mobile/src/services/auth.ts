import { Platform } from "react-native";
import api from "./api";
import { saveToken, removeToken } from "../utils/token";

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });

    const token = response.data.token;

    if (token === undefined || token === null) {
      throw new Error("Token not found in response");
    }

    await saveToken(token);

    return response.data.user;
  } catch (error: any) {
    throw error;
  }
}

export async function logout() {
  await api.post("/logout");

  await removeToken();
}

export async function getUser() {
  const response = await api.get("/user");

  return response.data;
}

export class ResetRequestError extends Error {}

function getApiOrigin(): string {
  const base = (process.env.EXPO_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!base) {
    throw new ResetRequestError("API base URL is not configured.");
  }
  return base.replace(/\/api$/, "");
}

function extractErrorMessage(error: any): string {
  const response = error?.response;
  if (!response) {
    return "Network error. Please check your connection and try again.";
  }

  const status = response.status;
  const data = response.data;

  if (status === 419) {
    return "Your session expired. Please try again.";
  }
  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first.length) {
      return String(first[0]);
    }
    if (typeof first === "string") {
      return first;
    }
  }

  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  if (status >= 500) {
    return "The server is having trouble. Please try again later.";
  }

  return "Something went wrong. Please try again.";
}

function parseSetCookie(raw: string | string[] | undefined): { name: string; value: string }[] {
  if (!raw) return [];

  const parts = Array.isArray(raw) ? raw : [raw];
  const cookies: { name: string; value: string }[] = [];

  for (const part of parts) {
    const segments = part.split(/,\s*(?=[\w!#$%&'*+\-.^`|~]+\s*=)/);
    for (const segment of segments) {
      const match = segment.trim().match(/^([^=\s;]+)=([^;]*)/);
      if (match) {
        cookies.push({ name: match[1], value: match[2] });
      }
    }
  }

  return cookies;
}

async function acquireNativeResetSession(): Promise<{ xsrfToken: string; cookieHeader: string }> {
  const csrfUrl = `${getApiOrigin()}/sanctum/csrf-cookie`;
  const response = await api.get(csrfUrl);

  const setCookie = (response.headers as any)?.["set-cookie"];
  const cookies = parseSetCookie(setCookie);

  const xsrfCookie = cookies.find((cookie) => cookie.name.toLowerCase() === "xsrf-token");
  if (!xsrfCookie) {
    throw new ResetRequestError(
      "Unable to start a secure reset session on this device. Please try again later."
    );
  }

  let decodedXsrf: string;
  try {
    decodedXsrf = decodeURIComponent(xsrfCookie.value);
  } catch {
    throw new ResetRequestError(
      "Unable to start a secure reset session on this device. Please try again later."
    );
  }
  const sessionCookies = cookies.filter(
    (cookie) => cookie.name.toLowerCase() !== "xsrf-token"
  );
  const cookieHeader = sessionCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

  return { xsrfToken: decodedXsrf, cookieHeader };
}

async function refreshCsrfSession(): Promise<Record<string, string> | null> {
  if (Platform.OS === "web") {
    await api.get(`${getApiOrigin()}/sanctum/csrf-cookie`, { withCredentials: true });
    return null;
  }

  const session = await acquireNativeResetSession();
  return {
    "Cookie": session.cookieHeader,
    "X-XSRF-TOKEN": session.xsrfToken,
  };
}

export async function requestPasswordReset(email: string): Promise<void> {
  const origin = getApiOrigin();
  const headers = await refreshCsrfSession();

  try {
    await api.post(
      `${origin}/forgot-password`,
      { email },
      headers ? { headers } : { withCredentials: true }
    );
  } catch (error) {
    throw new ResetRequestError(extractErrorMessage(error));
  }
}

export async function submitPasswordReset(input: {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
}): Promise<void> {
  const origin = getApiOrigin();
  const headers = await refreshCsrfSession();

  const payload = {
    email: input.email,
    token: input.token,
    password: input.password,
    password_confirmation: input.passwordConfirmation,
  };

  try {
    const response = await api.post(
      `${origin}/reset-password`,
      payload,
      headers ? { headers } : { withCredentials: true }
    );

    const finalUrl: string = (response.request as any)?.responseURL || "";
    if (finalUrl && !/\/login$/.test(finalUrl)) {
      throw new ResetRequestError(
        "The reset link is invalid or has expired. Please request a new one."
      );
    }
  } catch (error) {
    if (error instanceof ResetRequestError) {
      throw error;
    }
    throw new ResetRequestError(extractErrorMessage(error));
  }
}