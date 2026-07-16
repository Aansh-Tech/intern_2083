import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async config => {
  console.log("[api] REQUEST INTERCEPTOR - URL:", config.url, "Method:", config.method?.toUpperCase());
  const token = await getToken();
  console.log("[api] Token for request:", token ? token.substring(0, 20) + "..." : "null");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("[api] Authorization header SET.");
  } else {
    console.log("[api] No token — no Authorization header.");
  }
  return config;
});

api.interceptors.response.use(
  response => {
    console.log("[api] RESPONSE INTERCEPTOR - Status:", response.status, "URL:", response.config.url);
    const dataStr = JSON.stringify(response.data);
    console.log("[api] Response data:", dataStr.substring(0, 300));
    return response;
  },
  error => {
    console.log("[api] RESPONSE ERROR INTERCEPTOR");
    console.log("[api] error.message:", error.message);
    console.log("[api] error.response?.status:", error.response?.status);
    console.log("[api] error.response?.data:", JSON.stringify(error.response?.data));
    console.log("[api] error.stack:", error.stack);
    return Promise.reject(error);
  }
);

export default api;