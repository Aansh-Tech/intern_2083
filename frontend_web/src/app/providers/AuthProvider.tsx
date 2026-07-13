import {
  createContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const TOKEN_KEY = "auth_token";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

/**
 * Holds admin auth state app-wide so the Navbar, AdminLayout, and guarded
 * routes all see the same login state instantly -- not just on their own
 * mount. apiClient.ts reads the same "auth_token" localStorage key and
 * attaches it to every request automatically.
 *
 * TODO: once the backend's admin login endpoint exists, call it inside
 * login() and pass the returned token through, e.g.:
 *   const { data } = await apiClient.post("/admin/login", credentials);
 *   login(data.token);
 */
export function AuthProvider({ children }: { children: ReactNode }) {
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

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: Boolean(token), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}