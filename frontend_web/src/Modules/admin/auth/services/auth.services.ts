import { apiClient } from "@/services/apiClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  user: AdminUser;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AdminUser> {
    const { data } = await apiClient.post<LoginResponse>("/login", credentials);
    localStorage.setItem("auth_token", data.token);
    return data.user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/logout");
    } finally {
      localStorage.removeItem("auth_token");
    }
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    if (!localStorage.getItem("auth_token")) return null;
    try {
      const { data } = await apiClient.get<AdminUser>("/user");
      return data;
    } catch {
      localStorage.removeItem("auth_token");
      return null;
    }
  },

  async forgotPassword(email: string): Promise<string> {
    const { data } = await apiClient.post<{ message: string }>("/forgot-password", { email });
    return data.message;
  },

  async resetPassword(payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<string> {
    const { data } = await apiClient.post<{ message: string }>("/reset-password", payload);
    return data.message;
  },
};