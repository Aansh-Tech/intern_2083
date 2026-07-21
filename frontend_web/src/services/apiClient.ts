import axios from "axios";

/**
 * Central Axios instance used by every module's service file.
 *
 * VITE_API_BASE_URL should be set in your .env, e.g.:
 *   VITE_API_BASE_URL=http://localhost:8000/api
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// Attach the admin auth token (if present) to every outgoing request.
// Only relevant for admin-module calls, but harmless to attach everywhere --
// the public endpoints simply ignore it.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic centralized error handling -- expand once real error shapes are known.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired/invalid -- clear it so the app doesn't keep retrying as admin
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  }
);