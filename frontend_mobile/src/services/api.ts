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
  console.log("Base URL:", config.baseURL);
  console.log("Request URL:", config.url);

  const token = await getToken();
  console.log("Stored token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;