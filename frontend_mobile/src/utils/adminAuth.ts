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

export async function login(
  email: string,
  password: string,
  remember = false):
  Promise<boolean> {
  try {
    await authService.login(email, password, remember);
    return true;
  } catch (error) {
    console.log(error);
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