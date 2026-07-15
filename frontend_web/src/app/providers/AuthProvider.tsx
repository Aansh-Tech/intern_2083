import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authService, type AdminUser, type LoginCredentials } from "@/Modules/admin/auth/services/auth.services";

interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;
    authService.getCurrentUser().then((currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        setIsCheckingSession(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const currentUser = await authService.login(credentials);
    setUser(currentUser);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isCheckingSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}