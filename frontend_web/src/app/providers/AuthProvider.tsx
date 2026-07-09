import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  authService,
  type AdminUser,
  type LoginCredentials,
} from "../../Modules/admin/auth/services/auth.services";

interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

/**
 * Auth is session/cookie-based, so there's nothing to read from
 * localStorage on load. Instead, ask the backend "who is currently
 * logged in?" once when the app mounts.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setIsCheckingSession(false);
    });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    await authService.login(credentials);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isCheckingSession,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}