// src/services/apiClient.ts

import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Manually attach the XSRF token as a header on every request.
// Needed because axios's automatic XSRF handling is unreliable for
// cross-origin requests (frontend on :5173, backend on :8000 counts
// as a different origin even though both say "localhost").
// Without this, the CSRF cookie gets set fine by ensureCsrfCookie(),
// but the login/logout POST silently doesn't send it back, so Laravel
// rejects the session and login fails.
apiClient.interceptors.request.use((config) => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (match) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(match[1]);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);