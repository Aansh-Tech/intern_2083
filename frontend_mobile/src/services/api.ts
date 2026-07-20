import axios from "axios";
import { getToken } from "../utils/token";


console.log = () => {};
console.info = () => {};
console.debug = () => {};
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
  return method === "GET" && path.startsWith("/v1/blog-posts") && !path.startsWith("/v1/admin/blog-posts");
}

api.interceptors.request.use(async config => {
  const url = config.url || "";
  const method = (config.method || "get").toUpperCase();
  const path = stripHost(url);

  console.log(`=== [api] REQUEST: ${method} ${config.baseURL}${path}`);
  console.log(`=== [api]   config.url raw: "${url}"`);
  console.log(`=== [api]   stripped path:  "${path}"`);
  console.log(`=== [api]   isPublicGet? ${isPublicGet(url, method)}`);

  if (isPublicGet(url, method)) {
    console.log("=== [api]   => PUBLIC GET — no auth added");
    console.log(`=== [api]   => Headers:`, JSON.stringify(config.headers));
    return config;
  }

  const token = await getToken();
  console.log(`=== [api]   token loaded: ${token ? token.substring(0, 15) + "..." : "null"}`);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("=== [api]   => Auth header SET");
  } else {
    console.log("=== [api]   => No token — no auth");
  }

  console.log(`=== [api]   => Headers:`, JSON.stringify(config.headers));
  return config;
});

api.interceptors.response.use(
  response => {
    console.log(`=== [api] RESPONSE ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    const status = error.response?.status;
    const url = error.config?.url;
    console.log(`=== [api] ERROR ${status} ${url} ${error.message}`);
    if (error.response?.data) {
      console.log("=== [api]   body:", JSON.stringify(error.response.data).substring(0, 400));
    }
    return Promise.reject(error);
  }
);

export default api;
