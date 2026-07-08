import { useContext } from "react";
import { AuthContext } from "../../app/providers/AuthProvider";

/**
 * useAuth
 * Access admin auth state (user, login, logout) from anywhere.
 * Must be used within <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}