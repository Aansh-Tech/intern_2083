import * as authService from "../services/auth";


export async function login(
  email: string,
  password: string):
  Promise<boolean> {
  try {
    await authService.login(email, password);
    return true;
  } catch (error: any) {
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    await authService.logout();
  } catch (error) {
    // ignore
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