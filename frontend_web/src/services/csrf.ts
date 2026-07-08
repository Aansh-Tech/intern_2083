import axios from "axios";

const SANCTUM_BASE =
  import.meta.env.VITE_SANCTUM_BASE_URL ?? "http://localhost:8000";

/**
 * Sanctum SPA mode requires hitting this once before login/logout, so
 * Laravel can set the XSRF-TOKEN cookie that axios then automatically
 * attaches as a header on subsequent requests. This route is NOT under
 * /api -- it's provided directly by the Sanctum package.
 */
export async function ensureCsrfCookie(): Promise<void> {
  await axios.get(`${SANCTUM_BASE}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}