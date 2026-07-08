import { apiClient } from "../../../../services/apiClient";
import { ensureCsrfCookie } from "../../../../services/csrf";

/** 
 * Matches the real backend exactly, confirmed by backend team:
 *   POST /api/login   -- session/cookie auth (Sanctum SPA mode), NOT a token
 *   POST /api/logout
 *   GET  /api/user     -- returns the currently authenticated user, or 401
 *
 * IMPORTANT: must call ensureCsrfCookie() (GET /sanctum/csrf-cookie) before
 * login/logout, or Laravel will reject the request with a 419 CSRF
 * mismatch. apiClient.ts already has withCredentials: true set.
 */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<void> {
    await ensureCsrfCookie();
    await apiClient.post("/login", credentials);
  },

  async logout(): Promise<void> {
    await ensureCsrfCookie();
    await apiClient.post("/logout");
  },

  async getCurrentUser(): Promise<{ id: string; name: string; email: string } | null> {
    try {
      const { data } = await apiClient.get("/user");
      return data;
    } catch {
      return null;
    }
  },
};