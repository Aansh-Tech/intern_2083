import api from "./api";
import { saveToken, removeToken } from "../utils/token";

export async function login(email: string, password: string) {
  //console.log("[authService] login() called with email:", email);
  try {
    //console.log("[authService] Making POST /login request...");
    const response = await api.post("/login", {
      email,
      password,
    });
    //console.log("[authService] Response status:", response.status);
    //console.log("[authService] Response body:", JSON.stringify(response.data));

    const token = response.data.token;
   // console.log("[authService] Token received:", token ? token.substring(0, 30) + "..." : "UNDEFINED / NULL");

    if (token === undefined || token === null) {
      //console.log("[authService] FATAL: token is", token, "— response.data keys:", Object.keys(response.data));
      throw new Error("Token not found in response");
    }

    //console.log("[authService] Calling saveToken()...");
    await saveToken(token);
    //console.log("[authService] saveToken() completed successfully");

    //console.log("[authService] Returning user data:", JSON.stringify(response.data.user));
    return response.data.user;
  } catch (error: any) {
   // console.log("[authService] login() FAILED");
    //console.log("[authService] error.message:", error.message);
    //console.log("[authService] error.response?.status:", error.response?.status);
    //console.log("[authService] error.response?.data:", JSON.stringify(error.response?.data));
    //console.log("[authService] error.stack:", error.stack);
    throw error;
  }
}

export async function logout() {
  await api.post("/logout");

  await removeToken();
}

export async function getUser() {
  const response = await api.get("/user");

  return response.data;
}