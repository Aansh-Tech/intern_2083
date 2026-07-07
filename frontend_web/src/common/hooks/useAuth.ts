import { useState, useCallback } from "react";

const TOKEN_KEY = "auth_token";

/**
 * Simple admin auth hook. Reads/writes a bearer token to localStorage.
 * apiClient.ts already reads this same key and attaches it to every
 * request, so login/logout here is all that's needed to wire up admin
 * auth once the backend's login endpoint exists.
 *
 * TODO: once AuthController exists on the backend, replace login()'s
 * body with a real POST /admin/login call that returns a token.
 */
export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return {
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };
}