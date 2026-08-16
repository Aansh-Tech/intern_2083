import axios from "axios";
import { getToken } from "../utils/token";


const baseConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const api = axios.create(baseConfig);

function stripHost(url: string): string {
  return url.replace(/^https?:\/\/[^\/]+/, "");
}

function isPublicGet(url: string, method: string): boolean {
  const path = stripHost(url);
  if (method !== "GET") return false;
  if (path.startsWith("/v1/admin/")) return false;
  if (
    path.startsWith("/v1/blog-posts") ||
    path.startsWith("/v1/projects") ||
    path.startsWith("/v1/skills") ||
    path.startsWith("/v1/certificates") ||
    path.startsWith("/v1/profile") ||
    path.startsWith("/v1/social-links")
  ) {
    return true;
  }
  return false;
}

api.interceptors.request.use(async config => {
  const url = config.url || "";
  const method = (config.method || "get").toUpperCase();

  if (isPublicGet(url, method)) {
    return config;
  }

  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
