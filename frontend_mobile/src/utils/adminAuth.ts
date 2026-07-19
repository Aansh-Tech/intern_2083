// import AsyncStorage from "@react-native-async-storage/async-storage";

// const ADMIN_KEY = "admin_logged_in";
// const ADMIN_EMAIL = "admin@gmail.com";
// const ADMIN_PASSWORD = "password";

// export async function login(email: string, password: string): Promise<boolean> {
//   if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
//     await AsyncStorage.setItem(ADMIN_KEY, "true");
//     return true;
//   }
//   return false;
// }

// export async function logout(): Promise<void> {
//   await AsyncStorage.removeItem(ADMIN_KEY);
// }

// export async function isLoggedIn(): Promise<boolean> {
//   const value = await AsyncStorage.getItem(ADMIN_KEY);
//   return value === "true";
// }

// export async function requireAuth(): Promise<boolean> {
//   return isLoggedIn();
// }
import * as authService from "../services/auth";

console.log = () => {};
console.info = () => {};
console.debug = () => {};

let loginCallCount = 0;

export async function login(
  email: string,
  password: string):
  Promise<boolean> {
  loginCallCount++;
  console.log("[adminAuth] login() called (call #" + loginCallCount + ") with email:", email);
  try {
    console.log("[adminAuth] Calling authService.login()...");
    const result = await authService.login(email, password);
    console.log("[adminAuth] authService.login() succeeded. result:", result);
    console.log("[adminAuth] Returning true");
    return true;
  } catch (error: any) {
    console.log("[adminAuth] authService.login() FAILED");
    console.log("[adminAuth] error.message:", error.message);
    console.log("[adminAuth] error.response?.status:", error.response?.status);
    console.log("[adminAuth] error.response?.data:", JSON.stringify(error.response?.data));
    console.log("[adminAuth] error.stack:", error.stack);
    console.log("[adminAuth] Returning false");
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    await authService.logout();
  } catch (error) {
    console.log(error);
  }
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    await authService.getUser();
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth() {
  return isLoggedIn();
}